import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeeCalculation, CalculationDetail } from './entities/fee-calculation.entity';
import { CreateFeeCalculationDto } from './dto/create-fee-calculation.dto';
import { QueryFeeCalculationsDto } from './dto/query-fee-calculations.dto';
import { FeeTypesService } from '../fee-types/fee-types.service';
import { DocumentGroupsService } from '../document-groups/document-groups.service';
import { CalculationMethod } from '../fee-types/entities/fee-type.entity';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class FeeCalculationsService {
  constructor(
    @InjectRepository(FeeCalculation)
    private feeCalculationsRepository: Repository<FeeCalculation>,
    private feeTypesService: FeeTypesService,
    private documentGroupsService: DocumentGroupsService,
  ) {}

  /**
   * Calculate fee based on fee type and input data
   */
  private calculateFee(feeType: any, inputData: Record<string, any>): CalculationDetail {
    const detail: CalculationDetail = {
      subtotal: 0,
      totalFee: 0,
    };

    switch (feeType.calculationMethod) {
      case CalculationMethod.FIXED:
        detail.baseFee = Number(feeType.baseFee || 0);
        detail.subtotal = detail.baseFee;
        break;

      case CalculationMethod.PERCENT:
        const propertyValue = Number(inputData.property_value || 0);
        const percentage = Number(feeType.percentage || 0);
        detail.percentageFee = propertyValue * percentage;
        detail.subtotal = detail.percentageFee;
        break;

      case CalculationMethod.TIERED:
        if (feeType.formula && feeType.formula.tiers) {
          const propertyValue = Number(inputData.property_value || 0);
          detail.tieredFees = [];
          let remainingValue = propertyValue;

          for (const tier of feeType.formula.tiers) {
            const tierFrom = tier.from;
            const tierTo = tier.to || Infinity;
            const tierRate = tier.rate;

            if (remainingValue > 0 && propertyValue > tierFrom) {
              const tierMax = tierTo - tierFrom;
              const applicableValue = Math.min(remainingValue, tierMax);
              const tierAmount = applicableValue * tierRate;

              detail.tieredFees.push({
                tier: detail.tieredFees.length + 1,
                from: tierFrom,
                to: tier.to,
                rate: tierRate,
                amount: tierAmount,
                description: tier.description || `Tier ${detail.tieredFees.length + 1}`,
              });

              detail.subtotal += tierAmount;
              remainingValue -= applicableValue;
            }
          }
        }
        break;

      case CalculationMethod.VALUE_BASED:
        // Similar to TIERED but uses fixed amounts per bracket
        detail.baseFee = Number(feeType.baseFee || 0);
        detail.subtotal = detail.baseFee;
        break;

      case CalculationMethod.FORMULA:
        // Custom formula evaluation (simplified - in production, use safer evaluation)
        detail.baseFee = Number(feeType.baseFee || 0);
        detail.subtotal = detail.baseFee;
        break;

      default:
        throw new BadRequestException('Invalid calculation method');
    }

    // Apply additional fees
    if (feeType.formula && feeType.formula.additionalFees) {
      detail.additionalFees = [];

      for (const additionalFee of feeType.formula.additionalFees) {
        const quantity = additionalFee.perUnit
          ? Number(inputData[additionalFee.name.replace('_fee', '')] || inputData.num_copies || 1)
          : 1;

        const feeTotal = additionalFee.amount * quantity;

        detail.additionalFees.push({
          name: additionalFee.name,
          amount: additionalFee.amount,
          quantity: quantity,
          total: feeTotal,
          description: additionalFee.description || additionalFee.name,
        });

        detail.subtotal += feeTotal;
      }
    }

    // Apply min/max limits
    detail.totalFee = detail.subtotal;

    if (feeType.minFee && detail.totalFee < Number(feeType.minFee)) {
      detail.totalFee = Number(feeType.minFee);
    }

    if (feeType.maxFee && detail.totalFee > Number(feeType.maxFee)) {
      detail.totalFee = Number(feeType.maxFee);
    }

    return detail;
  }

  async create(
    createFeeCalculationDto: CreateFeeCalculationDto,
    userId?: string,
  ): Promise<FeeCalculation> {
    // Validate document group exists
    await this.documentGroupsService.findOne(createFeeCalculationDto.documentGroupId);

    // Validate fee type exists and is active
    const feeType = await this.feeTypesService.findOne(createFeeCalculationDto.feeTypeId);
    if (!feeType.status) {
      throw new BadRequestException('Fee type is not active');
    }

    // Calculate the fee
    const calculationResult = this.calculateFee(feeType, createFeeCalculationDto.inputData);

    // Create calculation record
    const feeCalculation = this.feeCalculationsRepository.create({
      userId: userId || null,
      documentGroupId: createFeeCalculationDto.documentGroupId,
      feeTypeId: createFeeCalculationDto.feeTypeId,
      inputData: createFeeCalculationDto.inputData,
      calculationResult,
      totalFee: calculationResult.totalFee,
    });

    return this.feeCalculationsRepository.save(feeCalculation);
  }

  async findAll(queryDto: QueryFeeCalculationsDto, userId?: string): Promise<PaginatedResult<FeeCalculation>> {
    const {
      page = 1,
      limit = 20,
      documentGroupId,
      feeTypeId,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = queryDto;

    // Build query
    const queryBuilder = this.feeCalculationsRepository.createQueryBuilder('fee_calculation');

    // Eager load relations
    queryBuilder.leftJoinAndSelect('fee_calculation.documentGroup', 'documentGroup');
    queryBuilder.leftJoinAndSelect('fee_calculation.feeType', 'feeType');
    queryBuilder.leftJoinAndSelect('fee_calculation.user', 'user');

    // Filter by user if provided
    if (userId) {
      queryBuilder.andWhere('fee_calculation.userId = :userId', { userId });
    } else if (queryDto.userId) {
      queryBuilder.andWhere('fee_calculation.userId = :userId', { userId: queryDto.userId });
    }

    // Apply filters
    if (documentGroupId) {
      queryBuilder.andWhere('fee_calculation.documentGroupId = :documentGroupId', { documentGroupId });
    }

    if (feeTypeId) {
      queryBuilder.andWhere('fee_calculation.feeTypeId = :feeTypeId', { feeTypeId });
    }

    // Apply sorting
    queryBuilder.orderBy(`fee_calculation.${sortBy}`, sortOrder);

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Execute query
    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<FeeCalculation> {
    const feeCalculation = await this.feeCalculationsRepository.findOne({
      where: { id },
      relations: ['documentGroup', 'feeType', 'user'],
    });

    if (!feeCalculation) {
      throw new NotFoundException(`Fee calculation with ID ${id} not found`);
    }

    return feeCalculation;
  }

  async findMyCalculations(userId: string, queryDto: QueryFeeCalculationsDto): Promise<PaginatedResult<FeeCalculation>> {
    return this.findAll(queryDto, userId);
  }
}
