import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Phone, Building, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useFloatingButtons } from '@/contexts/FloatingButtonsContext';

const FloatingServiceButton = () => {
  const { chatIsOpen, applicationIsOpen, setServiceButtonIsOpen } = useFloatingButtons();
  const [selectedService, setSelectedService] = useState<string>('');

  // State for form details (used for all contract types)
  const [formDetails, setFormDetails] = useState({
    // Common fields
    notaryLocation: '',
    customAddress: '',
    district: '',

    // Apartment fields
    houseType: '',
    buildYear: '',
    area: '',
    constructionLevel: '',
    basement: '',

    // Land fields
    landDistrict: '',
    landPosition: '',
    landStreet: '',
    landArea: '',
    landType: '',

    // House + Land fields
    houseDistrict: '',
    houseLandArea: '',
    houseFloorArea: '',
    houseStreet: '',
    houseLandType: '',
    houseBuildYear: '',
    housePosition: '',
    houseConstructionLevel: '',
    houseBasement: '',
  });

  // State for calculated fees
  const [calculatedFees, setCalculatedFees] = useState({
    baseFee: 0,
    travelFee: 0,
    overtimeFee: 0,
    totalFee: 0,
    distance: 0,
    isCalculated: false,
    isOutsideWorkingHours: false,
  });

  const contractTypes = [
    {
      value: 'apartment-sale',
      label: 'Hợp đồng mua bán căn hộ Chung Cư',
    },
    {
      value: 'land-transfer',
      label: 'Hợp đồng chuyển nhượng QSD Đất',
    },
    {
      value: 'apartment-gift',
      label: 'Hợp đồng tặng cho căn hộ Chung Cư',
    },
    {
      value: 'house-land-sale',
      label: 'Hợp đồng mua bán Nhà và chuyển nhượng QSD Đất',
    },
    {
      value: 'contract-amendment',
      label: 'Hợp đồng sửa đổi, bổ sung có thay đổi giá trị tài sản',
    },
    {
      value: 'apartment-contribution',
      label: 'Hợp đồng góp vốn bằng căn hộ Chung Cư',
    },
    {
      value: 'inheritance-division',
      label: 'Văn bản chia di sản thừa kế là Nhà - Đất',
    },
  ];

  // Options for apartment details form
  const houseTypeOptions = [
    { value: 'apartment', label: 'Căn hộ chung cư' },
    { value: 'penthouse', label: 'Penthouse' },
    { value: 'duplex', label: 'Duplex' },
    { value: 'studio', label: 'Studio' },
    { value: 'officetel', label: 'Officetel' },
  ];

  const constructionLevelOptions = [
    { value: 'level-1', label: 'Cấp 1 (Thấp tầng)' },
    { value: 'level-2', label: 'Cấp 2 (Trung bình)' },
    { value: 'level-3', label: 'Cấp 3 (Cao cấp)' },
    { value: 'level-4', label: 'Cấp 4 (Siêu cao cấp)' },
  ];

  const basementOptions = [
    { value: 'no-basement', label: 'Không có tầng hầm' },
    { value: '1-basement', label: '1 tầng hầm' },
    { value: '2-basement', label: '2 tầng hầm' },
    { value: '3-basement', label: '3+ tầng hầm' },
  ];

  const notaryLocationOptions = [
    { value: 'office', label: 'Tại văn phòng công chứng' },
    { value: 'outside', label: 'Ngoài văn phòng (tại địa chỉ khác)' },
  ];

  const addressOptions = [
    { value: 'hanoi', label: 'Hà Nội' },
    { value: 'hcm', label: 'TP. Hồ Chí Minh' },
    { value: 'danang', label: 'Đà Nẵng' },
    { value: 'haiphong', label: 'Hải Phòng' },
    { value: 'cantho', label: 'Cần Thơ' },
    { value: 'other', label: 'Tỉnh/Thành phố khác' },
  ];

  const districtOptions = {
    hanoi: [
      { value: 'ba-dinh', label: 'Ba Đình' },
      { value: 'hoan-kiem', label: 'Hoàn Kiếm' },
      { value: 'hai-ba-trung', label: 'Hai Bà Trưng' },
      { value: 'dong-da', label: 'Đống Đa' },
      { value: 'tay-ho', label: 'Tây Hồ' },
      { value: 'cau-giay', label: 'Cầu Giấy' },
      { value: 'thanh-xuan', label: 'Thanh Xuân' },
      { value: 'hoang-mai', label: 'Hoàng Mai' },
      { value: 'long-bien', label: 'Long Biên' },
      { value: 'nam-tu-liem', label: 'Nam Từ Liêm' },
      { value: 'bac-tu-liem', label: 'Bắc Từ Liêm' },
      { value: 'ha-dong', label: 'Hà Đông' },
      { value: 'thanh-tri', label: 'Thanh Trì' },
    ],
    hcm: [
      { value: 'quan-1', label: 'Quận 1' },
      { value: 'quan-2', label: 'Quận 2' },
      { value: 'quan-3', label: 'Quận 3' },
      { value: 'quan-4', label: 'Quận 4' },
      { value: 'quan-5', label: 'Quận 5' },
      { value: 'quan-6', label: 'Quận 6' },
      { value: 'quan-7', label: 'Quận 7' },
      { value: 'quan-8', label: 'Quận 8' },
      { value: 'quan-9', label: 'Quận 9' },
      { value: 'quan-10', label: 'Quận 10' },
      { value: 'quan-11', label: 'Quận 11' },
      { value: 'quan-12', label: 'Quận 12' },
      { value: 'binh-thanh', label: 'Bình Thạnh' },
      { value: 'go-vap', label: 'Gò Vấp' },
      { value: 'phu-nhuan', label: 'Phú Nhuận' },
      { value: 'tan-binh', label: 'Tân Bình' },
      { value: 'tan-phu', label: 'Tân Phú' },
      { value: 'thu-duc', label: 'Thủ Đức' },
    ],
    danang: [
      { value: 'hai-chau', label: 'Hải Châu' },
      { value: 'cam-le', label: 'Cẩm Lệ' },
      { value: 'thanh-khe', label: 'Thanh Khê' },
      { value: 'lien-chieu', label: 'Liên Chiểu' },
      { value: 'ngu-hanh-son', label: 'Ngũ Hành Sơn' },
      { value: 'son-tra', label: 'Sơn Trà' },
      { value: 'hoa-vang', label: 'Hòa Vang' },
      { value: 'hoang-sa', label: 'Hoàng Sa' },
    ],
    haiphong: [
      { value: 'hong-bang', label: 'Hồng Bàng' },
      { value: 'ngo-quyen', label: 'Ngô Quyền' },
      { value: 'le-chan', label: 'Lê Chân' },
      { value: 'hai-an', label: 'Hải An' },
      { value: 'kien-an', label: 'Kiến An' },
      { value: 'do-son', label: 'Đồ Sơn' },
      { value: 'duong-kinh', label: 'Dương Kinh' },
      { value: 'thuy-nguyen', label: 'Thủy Nguyên' },
    ],
    cantho: [
      { value: 'ninh-kieu', label: 'Ninh Kiều' },
      { value: 'binh-thuy', label: 'Bình Thủy' },
      { value: 'cai-rang', label: 'Cái Răng' },
      { value: 'o-mon', label: 'Ô Môn' },
      { value: 'thot-not', label: 'Thốt Nốt' },
      { value: 'co-do', label: 'Cờ Đỏ' },
      { value: 'vinh-thanh', label: 'Vĩnh Thạnh' },
      { value: 'phong-dien', label: 'Phong Điền' },
    ],
    other: [
      { value: 'center', label: 'Trung tâm thành phố' },
      { value: 'suburb', label: 'Ngoại thành' },
      { value: 'rural', label: 'Vùng nông thôn' },
    ],
  };

  // Additional options for new contract types
  const positionOptions = [
    { value: 'main-road', label: 'Mặt đường chính' },
    { value: 'alley', label: 'Hẻm/Ngõ' },
    { value: 'corner', label: 'Góc đường' },
    { value: 'inner', label: 'Trong khu dân cư' },
  ];

  const landTypeOptions = [
    { value: 'residential', label: 'Đất ở' },
    { value: 'commercial', label: 'Đất thương mại' },
    { value: 'industrial', label: 'Đất công nghiệp' },
    { value: 'agricultural', label: 'Đất nông nghiệp' },
    { value: 'mixed', label: 'Đất hỗn hợp' },
  ];

  const streetOptions = [
    { value: 'main-street', label: 'Đường chính' },
    { value: 'secondary-street', label: 'Đường phụ' },
    { value: 'alley-4m', label: 'Ngõ 4m' },
    { value: 'alley-6m', label: 'Ngõ 6m' },
    { value: 'alley-8m', label: 'Ngõ 8m+' },
  ];

  // Handle form field changes
  const handleFormDetailChange = (field: string, value: string) => {
    setFormDetails((prev) => {
      const newDetails = { ...prev, [field]: value };

      // Reset district when changing city
      if (field === 'customAddress') {
        newDetails.district = '';
      }

      return newDetails;
    });
    // Reset calculation when form changes
    setCalculatedFees((prev) => ({ ...prev, isCalculated: false }));
  };

  // Office address for distance calculation
  const officeAddress = '622 Đ. Kim Giang, Thanh Quang, Thanh Trì, Hà Nội';

  // Check if current time is outside working hours
  const isOutsideWorkingHours = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour + currentMinute / 60;

    // Sunday (0) - closed
    if (dayOfWeek === 0) {
      return true;
    }

    // Monday to Friday (1-5): 8:00 - 17:30
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      return currentTime < 8 || currentTime >= 17.5;
    }

    // Saturday (6): 8:00 - 12:00
    if (dayOfWeek === 6) {
      return currentTime < 8 || currentTime >= 12;
    }

    return false;
  };

  // Calculate base fee based on contract type and area
  const calculateBaseFee = (area: number, contractType: string) => {
    let baseFee = 0;

    // Base fees according to Vietnamese notary regulations
    switch (contractType) {
      case 'apartment-sale':
      case 'apartment-gift':
        // Phí công chứng hợp đồng mua bán/tặng cho căn hộ
        if (area <= 50) {
          baseFee = 150000; // Dưới 50m²
        } else if (area <= 100) {
          baseFee = 200000; // 50-100m²
        } else if (area <= 150) {
          baseFee = 250000; // 100-150m²
        } else {
          baseFee = 300000; // Trên 150m²
        }
        break;

      case 'land-transfer':
        // Phí công chứng chuyển nhượng QSD đất
        if (area <= 100) {
          baseFee = 200000; // Dưới 100m²
        } else if (area <= 500) {
          baseFee = 300000; // 100-500m²
        } else if (area <= 1000) {
          baseFee = 400000; // 500-1000m²
        } else {
          baseFee = 500000; // Trên 1000m²
        }
        break;

      case 'house-land-sale':
        // Phí công chứng mua bán nhà và chuyển nhượng QSD đất
        baseFee = 400000; // Phí cố định cho loại này
        break;

      case 'contract-amendment':
        // Phí sửa đổi, bổ sung hợp đồng
        baseFee = 150000;
        break;

      case 'apartment-contribution':
        // Phí góp vốn bằng căn hộ
        baseFee = 200000;
        break;

      case 'inheritance-division':
        // Phí chia di sản thừa kế
        baseFee = 300000;
        break;

      default:
        baseFee = 200000; // Phí mặc định
    }

    return baseFee;
  };

  // Calculate travel fee based on distance (updated rates)
  const calculateTravelFee = (distance: number) => {
    if (distance <= 5) return 0; // Miễn phí trong bán kính 5km
    if (distance <= 10) return 150000; // 5-10km: 150,000 VND
    if (distance <= 20) return 300000; // 10-20km: 300,000 VND
    if (distance <= 50) return 500000; // 20-50km: 500,000 VND
    if (distance <= 100) return 800000; // 50-100km: 800,000 VND
    return 1200000; // Trên 100km: 1,200,000 VND
  };

  // Simulate distance calculation (in real app, use Google Maps API)
  const calculateDistance = async (destination: string): Promise<number> => {
    // Simulate API call with different distances for different cities
    const distances = {
      hanoi: 15, // 15km within Hanoi
      hcm: 1700, // 1700km to Ho Chi Minh City
      danang: 800, // 800km to Da Nang
      haiphong: 120, // 120km to Hai Phong
      cantho: 1800, // 1800km to Can Tho
      other: 500, // Default 500km for other locations
    };

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return distances[destination as keyof typeof distances] || 500;
  };

  // Calculate total fees
  const calculateTotalFees = async () => {
    if (!formDetails.notaryLocation) return;

    let area = 0;

    // Get area based on contract type
    if (
      selectedService === 'apartment-sale' ||
      selectedService === 'apartment-gift' ||
      selectedService === 'apartment-contribution'
    ) {
      area = parseFloat(formDetails.area);
    } else if (selectedService === 'land-transfer' || selectedService === 'inheritance-division') {
      area = parseFloat(formDetails.landArea);
    } else if (selectedService === 'house-land-sale') {
      area = parseFloat(formDetails.houseFloorArea) || parseFloat(formDetails.houseLandArea);
    }

    // For contracts that don't require area (like contract-amendment), use default area
    if (selectedService === 'contract-amendment') {
      area = 1; // Use default area for calculation
    }

    if (isNaN(area) || area <= 0) return;

    // Calculate base fee
    const baseFee = calculateBaseFee(area, selectedService);

    let travelFee = 0;
    let distance = 0;

    // Calculate travel fee if outside office
    if (formDetails.notaryLocation === 'outside' && formDetails.customAddress) {
      distance = await calculateDistance(formDetails.customAddress);
      travelFee = calculateTravelFee(distance);
    }

    // Calculate overtime fee if outside working hours
    const outsideWorkingHours = isOutsideWorkingHours();
    const overtimeFee = outsideWorkingHours ? 200000 : 0; // Tăng phí ngoài giờ

    const totalFee = baseFee + travelFee + overtimeFee;

    setCalculatedFees({
      baseFee,
      travelFee,
      overtimeFee,
      totalFee,
      distance,
      isCalculated: true,
      isOutsideWorkingHours: outsideWorkingHours,
    });
  };

  // Check if form is complete for calculation
  const isFormComplete = () => {
    let required: string[] = ['notaryLocation'];

    // Add required fields based on contract type
    if (selectedService === 'apartment-sale' || selectedService === 'apartment-gift') {
      required = [...required, 'houseType', 'area'];
    } else if (selectedService === 'land-transfer') {
      required = [...required, 'landDistrict', 'landArea'];
    } else if (selectedService === 'house-land-sale') {
      required = [...required, 'houseDistrict', 'houseLandArea', 'houseFloorArea'];
    } else if (selectedService === 'contract-amendment') {
      // Contract amendment requires minimal info
      required = ['notaryLocation'];
    } else if (selectedService === 'apartment-contribution') {
      required = [...required, 'houseType', 'area'];
    } else if (selectedService === 'inheritance-division') {
      required = [...required, 'landDistrict', 'landArea'];
    }

    const hasRequired = required.every((field) => formDetails[field as keyof typeof formDetails]);

    if (formDetails.notaryLocation === 'outside') {
      return hasRequired && formDetails.customAddress && formDetails.district;
    }

    return hasRequired;
  };

  // Hide button when other floating buttons are open
  const shouldHide = chatIsOpen || applicationIsOpen;

  return (
    <div
      className={cn(
        'fixed bottom-28 right-2 sm:bottom-36 sm:right-4 md:bottom-40 lg:bottom-44 xl:bottom-48 2xl:bottom-50 md:right-6 z-40 transition-all duration-300 group',
        shouldHide && 'opacity-0 pointer-events-none',
      )}
    >
      <Dialog onOpenChange={setServiceButtonIsOpen}>
        <DialogTrigger asChild>
          <Button
            className={cn(
              'h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full shadow-2xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-110 border-2 border-white',
            )}
          >
            <div className="relative">
              <Calculator className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
            </div>
          </Button>
        </DialogTrigger>

        {/* Tooltip */}
        <div className="absolute top-1/2 right-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none transform -translate-y-1/2 -translate-x-2">
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
            Tính phí công chứng - Miễn phí!
            <div className="absolute top-1/2 left-full w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900 transform -translate-y-1/2"></div>
          </div>
        </div>

        <DialogContent className="max-w-6xl max-h-[98vh] overflow-y-auto w-[100vw] sm:w-[99vw] md:w-[98vw] lg:w-[95vw] xl:w-[90vw] 2xl:w-[80vw] m-0 sm:m-1 md:m-4 p-2 sm:p-4 md:p-6">
          <DialogHeader className="pb-2 sm:pb-4 md:pb-6">
            <DialogTitle className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl font-bold text-primary flex items-center">
              <Calculator className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1 sm:mr-2 md:mr-3 flex-shrink-0" />
              <span className="truncate">Tính phí công chứng</span>
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm md:text-base">
              Chọn loại hợp đồng để tính phí công chứng.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Contract Type Selector */}
            <div className="space-y-2 sm:space-y-3">
              <Label
                htmlFor="service-select"
                className="text-xs sm:text-sm md:text-base font-semibold text-gray-900"
              >
                Chọn loại hợp đồng cần tính phí:
              </Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger className="w-full h-9 sm:h-10 md:h-12 text-xs sm:text-sm md:text-base">
                  <SelectValue placeholder="-- Chọn loại hợp đồng --" />
                </SelectTrigger>
                <SelectContent>
                  {contractTypes.map((contract) => (
                    <SelectItem
                      key={contract.value}
                      value={contract.value}
                      className="text-xs sm:text-sm md:text-base"
                    >
                      {contract.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Apartment Details Form - Only show for apartment sale contract */}
            {selectedService === 'apartment-sale' && (
              <div className="border border-gray-200 rounded-lg p-2 sm:p-3 md:p-4 lg:p-6 bg-gray-50">
                <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 md:mb-4 flex items-center">
                  <Building className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2 text-primary" />
                  Thông tin chi tiết căn hộ
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 space-y-2 sm:space-y-0">
                  {/* House Type */}
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="house-type" className="text-xs font-medium text-gray-700">
                      Loại Nhà <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formDetails.houseType}
                      onValueChange={(value) => handleFormDetailChange('houseType', value)}
                    >
                      <SelectTrigger className="h-8 sm:h-9 md:h-10 text-xs">
                        <SelectValue placeholder="Chọn loại nhà" />
                      </SelectTrigger>
                      <SelectContent>
                        {houseTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="text-xs">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Build Year */}
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="build-year" className="text-xs font-medium text-gray-700">
                      Năm xây dựng <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="build-year"
                      type="number"
                      placeholder="VD: 2020"
                      value={formDetails.buildYear}
                      onChange={(e) => handleFormDetailChange('buildYear', e.target.value)}
                      min="1990"
                      max={new Date().getFullYear()}
                      className="h-8 sm:h-9 md:h-10 text-xs"
                    />
                  </div>

                  {/* Area */}
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="area" className="text-xs sm:text-sm font-medium text-gray-700">
                      Diện tích nhà/m² <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="area"
                      type="number"
                      placeholder="VD: 80"
                      value={formDetails.area}
                      onChange={(e) => handleFormDetailChange('area', e.target.value)}
                      min="1"
                      className="h-9 sm:h-10 text-xs sm:text-sm"
                    />
                  </div>

                  {/* Construction Level */}
                  <div className="space-y-1 sm:space-y-2">
                    <Label
                      htmlFor="construction-level"
                      className="text-xs sm:text-sm font-medium text-gray-700"
                    >
                      Cấp công trình <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formDetails.constructionLevel}
                      onValueChange={(value) => handleFormDetailChange('constructionLevel', value)}
                    >
                      <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                        <SelectValue placeholder="Chọn cấp công trình" />
                      </SelectTrigger>
                      <SelectContent>
                        {constructionLevelOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-xs sm:text-sm"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Basement */}
                  <div className="space-y-1 sm:space-y-2">
                    <Label
                      htmlFor="basement"
                      className="text-xs sm:text-sm font-medium text-gray-700"
                    >
                      Tầng hầm
                    </Label>
                    <Select
                      value={formDetails.basement}
                      onValueChange={(value) => handleFormDetailChange('basement', value)}
                    >
                      <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                        <SelectValue placeholder="Chọn tầng hầm" />
                      </SelectTrigger>
                      <SelectContent>
                        {basementOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-xs sm:text-sm"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Notary Location */}
                  <div className="space-y-1 sm:space-y-2">
                    <Label
                      htmlFor="notary-location"
                      className="text-xs sm:text-sm font-medium text-gray-700"
                    >
                      Lựa chọn địa điểm công chứng <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formDetails.notaryLocation}
                      onValueChange={(value) => handleFormDetailChange('notaryLocation', value)}
                    >
                      <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                        <SelectValue placeholder="Chọn địa điểm công chứng" />
                      </SelectTrigger>
                      <SelectContent>
                        {notaryLocationOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-xs sm:text-sm"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Custom Address - Only show if "outside" is selected */}
                {formDetails.notaryLocation === 'outside' && (
                  <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="custom-address"
                        className="text-xs sm:text-sm font-medium text-gray-700"
                      >
                        Tỉnh/Thành phố <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formDetails.customAddress}
                        onValueChange={(value) => handleFormDetailChange('customAddress', value)}
                      >
                        <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                          <SelectValue placeholder="Chọn tỉnh/thành phố" />
                        </SelectTrigger>
                        <SelectContent>
                          {addressOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="text-xs sm:text-sm"
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* District Selection - Only show if city is selected */}
                    {formDetails.customAddress && (
                      <div className="space-y-1 sm:space-y-2">
                        <Label
                          htmlFor="district"
                          className="text-xs sm:text-sm font-medium text-gray-700"
                        >
                          Quận/Huyện <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formDetails.district}
                          onValueChange={(value) => handleFormDetailChange('district', value)}
                        >
                          <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                            <SelectValue placeholder="Chọn quận/huyện" />
                          </SelectTrigger>
                          <SelectContent>
                            {districtOptions[
                              formDetails.customAddress as keyof typeof districtOptions
                            ]?.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className="text-xs sm:text-sm"
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )}

                {/* Calculate Fee Button */}
                {isFormComplete() && !calculatedFees.isCalculated && (
                  <div className="mt-3 sm:mt-4 md:mt-6 text-center">
                    <Button
                      onClick={calculateTotalFees}
                      className="bg-primary hover:bg-primary/90 text-white font-semibold px-3 sm:px-6 md:px-8 py-2 sm:py-3 text-xs sm:text-sm md:text-base w-full sm:w-auto h-9 sm:h-10 md:h-11"
                    >
                      <Calculator className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2" />
                      <span className="hidden xs:inline">Tính phí công chứng</span>
                      <span className="xs:hidden">Tính phí</span>
                    </Button>
                  </div>
                )}

                {/* Fee Calculation Results */}
                {calculatedFees.isCalculated && (
                  <div className="mt-4 sm:mt-6 border border-green-200 rounded-lg overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50">
                    <div className="bg-green-100 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-green-200">
                      <h4 className="font-bold text-base sm:text-lg text-green-800 flex items-center">
                        <Calculator className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Kết quả tính phí công chứng
                      </h4>
                    </div>
                    <div className="p-3 sm:p-4 lg:p-6">
                      <div className="space-y-4">
                        {/* Base Fee */}
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                          <span className="text-gray-700">Phí công chứng cơ bản:</span>
                          <span className="font-bold text-lg text-primary">
                            {calculatedFees.baseFee.toLocaleString('vi-VN')} VNĐ
                          </span>
                        </div>

                        {/* Travel Fee */}
                        {formDetails.notaryLocation === 'outside' && (
                          <>
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                              <div>
                                <span className="text-gray-700">Phí di chuyển:</span>
                                <div className="text-xs text-gray-500">
                                  Khoảng cách: ~{calculatedFees.distance}km
                                </div>
                              </div>
                              <span className="font-bold text-lg text-orange-600">
                                {calculatedFees.travelFee.toLocaleString('vi-VN')} VNĐ
                              </span>
                            </div>
                          </>
                        )}

                        {/* Overtime Fee */}
                        {calculatedFees.isOutsideWorkingHours && (
                          <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                            <div>
                              <span className="text-gray-700">Phí ngoài giờ làm việc:</span>
                              <div className="text-xs text-gray-500">
                                {new Date().getDay() === 0
                                  ? 'Chủ nhật'
                                  : new Date().getDay() === 6
                                    ? 'Thứ 7 (sau 12:00)'
                                    : 'Ngoài giờ 8:00-17:30'}
                              </div>
                            </div>
                            <span className="font-bold text-lg text-red-600">
                              {calculatedFees.overtimeFee.toLocaleString('vi-VN')} VNĐ
                            </span>
                          </div>
                        )}

                        {/* Total Fee */}
                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border-2 border-green-300">
                          <span className="text-green-800 font-semibold text-lg">Tổng phí:</span>
                          <span className="font-bold text-2xl text-green-700">
                            {calculatedFees.totalFee.toLocaleString('vi-VN')} VNĐ
                          </span>
                        </div>

                        {/* Fee Breakdown */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h5 className="font-semibold text-blue-900 mb-2">Chi tiết tính phí:</h5>
                          <div className="text-sm text-blue-800 space-y-1">
                            <p>
                              • Loại hợp đồng:{' '}
                              {contractTypes.find((opt) => opt.value === selectedService)?.label}
                            </p>

                            {/* Show area information based on contract type */}
                            {[
                              'apartment-sale',
                              'apartment-gift',
                              'apartment-contribution',
                            ].includes(selectedService) &&
                              formDetails.area && <p>• Diện tích căn hộ: {formDetails.area} m²</p>}

                            {['land-transfer', 'inheritance-division'].includes(selectedService) &&
                              formDetails.landArea && (
                                <p>• Diện tích đất: {formDetails.landArea} m²</p>
                              )}

                            {(selectedService as string) === 'house-land-sale' && (
                              <>
                                {formDetails.houseLandArea && (
                                  <p>• Diện tích đất: {formDetails.houseLandArea} m²</p>
                                )}
                                {formDetails.houseFloorArea && (
                                  <p>• Diện tích sàn: {formDetails.houseFloorArea} m²</p>
                                )}
                              </>
                            )}

                            {(selectedService as string) === 'contract-amendment' && (
                              <p>• Phí sửa đổi, bổ sung hợp đồng</p>
                            )}

                            <p>
                              • Phí công chứng cơ bản:{' '}
                              {calculatedFees.baseFee.toLocaleString('vi-VN')} VNĐ
                            </p>

                            {formDetails.notaryLocation === 'outside' && (
                              <>
                                <p>
                                  • Địa điểm công chứng:{' '}
                                  {
                                    addressOptions.find(
                                      (opt) => opt.value === formDetails.customAddress,
                                    )?.label
                                  }
                                </p>
                                {formDetails.district && (
                                  <p>
                                    • Quận/Huyện:{' '}
                                    {
                                      districtOptions[
                                        formDetails.customAddress as keyof typeof districtOptions
                                      ]?.find((opt) => opt.value === formDetails.district)?.label
                                    }
                                  </p>
                                )}
                                <p>• Khoảng cách từ văn phòng: ~{calculatedFees.distance}km</p>
                                <p>
                                  • Phí di chuyển:{' '}
                                  {calculatedFees.travelFee.toLocaleString('vi-VN')} VNĐ
                                </p>
                              </>
                            )}

                            {calculatedFees.isOutsideWorkingHours && (
                              <p>• Thời gian: Ngoài giờ làm việc (+200,000 VNĐ)</p>
                            )}

                            <p>• Giờ làm việc: T2-T6 (8:00-17:30), T7 (8:00-12:00), CN nghỉ</p>

                            {/* Show calculation method */}
                            {!['contract-amendment'].includes(selectedService) && (
                              <p>• Phương pháp tính: Theo diện tích và loại hợp đồng</p>
                            )}

                            <p className="text-xs text-blue-600 mt-2">
                              * Phí trên chưa bao gồm thuế VAT và các chi phí phát sinh khác
                            </p>
                          </div>
                        </div>

                        {/* Recalculate Button */}
                        <div className="text-center pt-2">
                          <Button
                            onClick={() =>
                              setCalculatedFees((prev) => ({ ...prev, isCalculated: false }))
                            }
                            variant="outline"
                            className="text-primary border-primary hover:bg-primary hover:text-white"
                          >
                            Tính lại phí
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Summary */}
                {isFormComplete() && !calculatedFees.isCalculated && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Tóm tắt thông tin:</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>
                        • Loại hợp đồng:{' '}
                        <span className="font-medium">
                          {contractTypes.find((opt) => opt.value === selectedService)?.label}
                        </span>
                      </p>

                      {/* Apartment details */}
                      {['apartment-sale', 'apartment-gift', 'apartment-contribution'].includes(
                        selectedService,
                      ) && (
                        <>
                          {formDetails.houseType && (
                            <p>
                              • Loại nhà:{' '}
                              <span className="font-medium">
                                {
                                  houseTypeOptions.find(
                                    (opt) => opt.value === formDetails.houseType,
                                  )?.label
                                }
                              </span>
                            </p>
                          )}
                          {formDetails.buildYear && (
                            <p>
                              • Năm xây dựng:{' '}
                              <span className="font-medium">{formDetails.buildYear}</span>
                            </p>
                          )}
                          {formDetails.area && (
                            <p>
                              • Diện tích:{' '}
                              <span className="font-medium">{formDetails.area} m²</span>
                            </p>
                          )}
                          {formDetails.constructionLevel && (
                            <p>
                              • Cấp công trình:{' '}
                              <span className="font-medium">
                                {
                                  constructionLevelOptions.find(
                                    (opt) => opt.value === formDetails.constructionLevel,
                                  )?.label
                                }
                              </span>
                            </p>
                          )}
                          {formDetails.basement && (
                            <p>
                              • Tầng hầm:{' '}
                              <span className="font-medium">
                                {
                                  basementOptions.find((opt) => opt.value === formDetails.basement)
                                    ?.label
                                }
                              </span>
                            </p>
                          )}
                        </>
                      )}

                      {/* Land details */}
                      {['land-transfer', 'inheritance-division'].includes(selectedService) && (
                        <>
                          {formDetails.landDistrict && (
                            <p>
                              • Quận/Huyện:{' '}
                              <span className="font-medium">
                                {
                                  districtOptions.hanoi.find(
                                    (opt) => opt.value === formDetails.landDistrict,
                                  )?.label
                                }
                              </span>
                            </p>
                          )}
                          {formDetails.landArea && (
                            <p>
                              • Diện tích đất:{' '}
                              <span className="font-medium">{formDetails.landArea} m²</span>
                            </p>
                          )}
                          {formDetails.landPosition && (
                            <p>
                              • Vị trí:{' '}
                              <span className="font-medium">
                                {
                                  positionOptions.find(
                                    (opt) => opt.value === formDetails.landPosition,
                                  )?.label
                                }
                              </span>
                            </p>
                          )}
                          {formDetails.landStreet && (
                            <p>
                              • Đường/Phố:{' '}
                              <span className="font-medium">
                                {
                                  streetOptions.find((opt) => opt.value === formDetails.landStreet)
                                    ?.label
                                }
                              </span>
                            </p>
                          )}
                          {formDetails.landType && (
                            <p>
                              • Loại đất:{' '}
                              <span className="font-medium">
                                {
                                  landTypeOptions.find((opt) => opt.value === formDetails.landType)
                                    ?.label
                                }
                              </span>
                            </p>
                          )}
                        </>
                      )}

                      {/* House + Land details */}
                      {(selectedService as string) === 'house-land-sale' && (
                        <>
                          {formDetails.houseDistrict && (
                            <p>
                              • Quận/Huyện:{' '}
                              <span className="font-medium">
                                {
                                  districtOptions.hanoi.find(
                                    (opt) => opt.value === formDetails.houseDistrict,
                                  )?.label
                                }
                              </span>
                            </p>
                          )}
                          {formDetails.houseLandArea && (
                            <p>
                              • Diện tích đất:{' '}
                              <span className="font-medium">{formDetails.houseLandArea} m²</span>
                            </p>
                          )}
                          {formDetails.houseFloorArea && (
                            <p>
                              • Diện tích sàn:{' '}
                              <span className="font-medium">{formDetails.houseFloorArea} m²</span>
                            </p>
                          )}
                          {formDetails.houseStreet && (
                            <p>
                              • Đường/Phố:{' '}
                              <span className="font-medium">
                                {
                                  streetOptions.find((opt) => opt.value === formDetails.houseStreet)
                                    ?.label
                                }
                              </span>
                            </p>
                          )}
                          {formDetails.houseLandType && (
                            <p>
                              • Loại đất:{' '}
                              <span className="font-medium">
                                {
                                  landTypeOptions.find(
                                    (opt) => opt.value === formDetails.houseLandType,
                                  )?.label
                                }
                              </span>
                            </p>
                          )}
                          {formDetails.houseBuildYear && (
                            <p>
                              • Năm xây dựng:{' '}
                              <span className="font-medium">{formDetails.houseBuildYear}</span>
                            </p>
                          )}
                          {formDetails.housePosition && (
                            <p>
                              • Vị trí:{' '}
                              <span className="font-medium">
                                {
                                  positionOptions.find(
                                    (opt) => opt.value === formDetails.housePosition,
                                  )?.label
                                }
                              </span>
                            </p>
                          )}
                          {formDetails.houseConstructionLevel && (
                            <p>
                              • Cấp công trình:{' '}
                              <span className="font-medium">
                                {
                                  constructionLevelOptions.find(
                                    (opt) => opt.value === formDetails.houseConstructionLevel,
                                  )?.label
                                }
                              </span>
                            </p>
                          )}
                          {formDetails.houseBasement && (
                            <p>
                              • Tầng hầm:{' '}
                              <span className="font-medium">
                                {
                                  basementOptions.find(
                                    (opt) => opt.value === formDetails.houseBasement,
                                  )?.label
                                }
                              </span>
                            </p>
                          )}
                        </>
                      )}

                      {/* Common details */}
                      {formDetails.notaryLocation && (
                        <p>
                          • Địa điểm công chứng:{' '}
                          <span className="font-medium">
                            {
                              notaryLocationOptions.find(
                                (opt) => opt.value === formDetails.notaryLocation,
                              )?.label
                            }
                          </span>
                        </p>
                      )}
                      {formDetails.customAddress && (
                        <p>
                          • Địa chỉ công chứng:{' '}
                          <span className="font-medium">
                            {
                              addressOptions.find((opt) => opt.value === formDetails.customAddress)
                                ?.label
                            }
                          </span>
                        </p>
                      )}
                      {formDetails.district && (
                        <p>
                          • Quận/Huyện:{' '}
                          <span className="font-medium">
                            {
                              districtOptions[
                                formDetails.customAddress as keyof typeof districtOptions
                              ]?.find((opt) => opt.value === formDetails.district)?.label
                            }
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Land Transfer Form - Only show for land transfer contract */}
            {selectedService === 'land-transfer' && (
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6 bg-gray-50">
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <Building className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" />
                  Thông tin chi tiết đất
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 space-y-3 sm:space-y-0">
                  {/* District */}
                  <div className="space-y-1 sm:space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-gray-700">
                      Quận/Huyện <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formDetails.landDistrict}
                      onValueChange={(value) => handleFormDetailChange('landDistrict', value)}
                    >
                      <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                        <SelectValue placeholder="Chọn quận/huyện" />
                      </SelectTrigger>
                      <SelectContent>
                        {districtOptions.hanoi.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-xs sm:text-sm"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Position */}
                  <div className="space-y-1 sm:space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-gray-700">
                      Vị trí <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formDetails.landPosition}
                      onValueChange={(value) => handleFormDetailChange('landPosition', value)}
                    >
                      <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                        <SelectValue placeholder="Chọn vị trí" />
                      </SelectTrigger>
                      <SelectContent>
                        {positionOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-xs sm:text-sm"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Street */}
                  <div className="space-y-1 sm:space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-gray-700">
                      Đường/Phố <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formDetails.landStreet}
                      onValueChange={(value) => handleFormDetailChange('landStreet', value)}
                    >
                      <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                        <SelectValue placeholder="Chọn đường/phố" />
                      </SelectTrigger>
                      <SelectContent>
                        {streetOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-xs sm:text-sm"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Land Area */}
                  <div className="space-y-1 sm:space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-gray-700">
                      Diện tích đất/m² <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      placeholder="VD: 100"
                      value={formDetails.landArea}
                      onChange={(e) => handleFormDetailChange('landArea', e.target.value)}
                      min="1"
                      className="h-9 sm:h-10 text-xs sm:text-sm"
                    />
                  </div>

                  {/* Land Type */}
                  <div className="space-y-1 sm:space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-gray-700">
                      Loại đất <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formDetails.landType}
                      onValueChange={(value) => handleFormDetailChange('landType', value)}
                    >
                      <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                        <SelectValue placeholder="Chọn loại đất" />
                      </SelectTrigger>
                      <SelectContent>
                        {landTypeOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-xs sm:text-sm"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Notary Location */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Lựa chọn địa điểm công chứng <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formDetails.notaryLocation}
                      onValueChange={(value) => handleFormDetailChange('notaryLocation', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn địa điểm công chứng" />
                      </SelectTrigger>
                      <SelectContent>
                        {notaryLocationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Custom Address for Land Transfer */}
                {formDetails.notaryLocation === 'outside' && (
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Tỉnh/Thành phố <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formDetails.customAddress}
                        onValueChange={(value) => handleFormDetailChange('customAddress', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn tỉnh/thành phố" />
                        </SelectTrigger>
                        <SelectContent>
                          {addressOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {formDetails.customAddress && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Quận/Huyện <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formDetails.district}
                          onValueChange={(value) => handleFormDetailChange('district', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn quận/huyện" />
                          </SelectTrigger>
                          <SelectContent>
                            {districtOptions[
                              formDetails.customAddress as keyof typeof districtOptions
                            ]?.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )}

                {/* Calculate Fee Button */}
                {isFormComplete() && !calculatedFees.isCalculated && (
                  <div className="mt-3 sm:mt-4 md:mt-6 text-center">
                    <Button
                      onClick={calculateTotalFees}
                      className="bg-primary hover:bg-primary/90 text-white font-semibold px-3 sm:px-6 md:px-8 py-2 sm:py-3 text-xs sm:text-sm md:text-base w-full sm:w-auto h-9 sm:h-10 md:h-11"
                    >
                      <Calculator className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2" />
                      <span className="hidden xs:inline">Tính phí công chứng</span>
                      <span className="xs:hidden">Tính phí</span>
                    </Button>
                  </div>
                )}

                {/* Fee Calculation Results */}
                {calculatedFees.isCalculated && (
                  <div className="mt-4 sm:mt-6 border border-green-200 rounded-lg overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50">
                    <div className="bg-green-100 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-green-200">
                      <h4 className="font-bold text-base sm:text-lg text-green-800 flex items-center">
                        <Calculator className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Kết quả tính phí công chứng
                      </h4>
                    </div>
                    <div className="p-3 sm:p-4 lg:p-6">
                      <div className="space-y-4">
                        {/* Base Fee */}
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                          <span className="text-gray-700">Phí công chứng cơ bản:</span>
                          <span className="font-bold text-lg text-primary">
                            {calculatedFees.baseFee.toLocaleString('vi-VN')} VNĐ
                          </span>
                        </div>

                        {/* Travel Fee */}
                        {formDetails.notaryLocation === 'outside' && (
                          <>
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                              <div>
                                <span className="text-gray-700">Phí di chuyển:</span>
                                <div className="text-xs text-gray-500">
                                  Khoảng cách: ~{calculatedFees.distance}km
                                </div>
                              </div>
                              <span className="font-bold text-lg text-orange-600">
                                {calculatedFees.travelFee.toLocaleString('vi-VN')} VNĐ
                              </span>
                            </div>
                          </>
                        )}

                        {/* Overtime Fee */}
                        {calculatedFees.isOutsideWorkingHours && (
                          <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                            <div>
                              <span className="text-gray-700">Phí ngoài giờ làm việc:</span>
                              <div className="text-xs text-gray-500">
                                {new Date().getDay() === 0
                                  ? 'Chủ nhật'
                                  : new Date().getDay() === 6
                                    ? 'Thứ 7 (sau 12:00)'
                                    : 'Ngoài giờ 8:00-17:30'}
                              </div>
                            </div>
                            <span className="font-bold text-lg text-red-600">
                              {calculatedFees.overtimeFee.toLocaleString('vi-VN')} VNĐ
                            </span>
                          </div>
                        )}

                        {/* Total Fee */}
                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border-2 border-green-300">
                          <span className="text-green-800 font-semibold text-lg">Tổng phí:</span>
                          <span className="font-bold text-2xl text-green-700">
                            {calculatedFees.totalFee.toLocaleString('vi-VN')} VNĐ
                          </span>
                        </div>

                        {/* Recalculate Button */}
                        <div className="text-center pt-2">
                          <Button
                            onClick={() =>
                              setCalculatedFees((prev) => ({ ...prev, isCalculated: false }))
                            }
                            variant="outline"
                            className="text-primary border-primary hover:bg-primary hover:text-white"
                          >
                            Tính lại phí
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Apartment Gift Form - Only show for apartment gift contract */}
            {selectedService === 'apartment-gift' && (
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6 bg-gray-50">
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <Building className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" />
                  Thông tin chi tiết căn hộ tặng cho
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 space-y-3 sm:space-y-0">
                  {/* House Type */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Loại Nhà <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formDetails.houseType}
                      onValueChange={(value) => handleFormDetailChange('houseType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại nhà" />
                      </SelectTrigger>
                      <SelectContent>
                        {houseTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Build Year */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Năm xây dựng <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      placeholder="VD: 2020"
                      value={formDetails.buildYear}
                      onChange={(e) => handleFormDetailChange('buildYear', e.target.value)}
                      min="1990"
                      max={new Date().getFullYear()}
                    />
                  </div>

                  {/* Construction Level */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Cấp công trình <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formDetails.constructionLevel}
                      onValueChange={(value) => handleFormDetailChange('constructionLevel', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn cấp công trình" />
                      </SelectTrigger>
                      <SelectContent>
                        {constructionLevelOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Area */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Diện tích nhà/m² <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      placeholder="VD: 80"
                      value={formDetails.area}
                      onChange={(e) => handleFormDetailChange('area', e.target.value)}
                      min="1"
                    />
                  </div>

                  {/* Basement */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Tầng hầm</Label>
                    <Select
                      value={formDetails.basement}
                      onValueChange={(value) => handleFormDetailChange('basement', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tầng hầm" />
                      </SelectTrigger>
                      <SelectContent>
                        {basementOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Notary Location */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Lựa chọn địa điểm công chứng <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formDetails.notaryLocation}
                      onValueChange={(value) => handleFormDetailChange('notaryLocation', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn địa điểm công chứng" />
                      </SelectTrigger>
                      <SelectContent>
                        {notaryLocationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Custom Address for Apartment Gift */}
                {formDetails.notaryLocation === 'outside' && (
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Tỉnh/Thành phố <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formDetails.customAddress}
                        onValueChange={(value) => handleFormDetailChange('customAddress', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn tỉnh/thành phố" />
                        </SelectTrigger>
                        <SelectContent>
                          {addressOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {formDetails.customAddress && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Quận/Huyện <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formDetails.district}
                          onValueChange={(value) => handleFormDetailChange('district', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn quận/huyện" />
                          </SelectTrigger>
                          <SelectContent>
                            {districtOptions[
                              formDetails.customAddress as keyof typeof districtOptions
                            ]?.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* House and Land Sale Form - Only show for house and land sale contract */}
            {selectedService === 'house-land-sale' && (
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6 bg-gray-50">
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <Building className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" />
                  Thông tin chi tiết nhà và đất
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 space-y-3 sm:space-y-0">
                  {/* District */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Quận/Huyện <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formDetails.houseDistrict}
                      onValueChange={(value) => handleFormDetailChange('houseDistrict', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn quận/huyện" />
                      </SelectTrigger>
                      <SelectContent>
                        {districtOptions.hanoi.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Land Area */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Diện tích đất/m² <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      placeholder="VD: 100"
                      value={formDetails.houseLandArea}
                      onChange={(e) => handleFormDetailChange('houseLandArea', e.target.value)}
                      min="1"
                    />
                  </div>

                  {/* Floor Area */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Diện tích sàn xây dựng/m² <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      placeholder="VD: 150"
                      value={formDetails.houseFloorArea}
                      onChange={(e) => handleFormDetailChange('houseFloorArea', e.target.value)}
                      min="1"
                    />
                    <div className="text-xs text-gray-500">Tổng diện tích các tầng</div>
                  </div>

                  {/* Street */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Đường/Phố <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formDetails.houseStreet}
                      onValueChange={(value) => handleFormDetailChange('houseStreet', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn đường/phố" />
                      </SelectTrigger>
                      <SelectContent>
                        {streetOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Land Type */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Loại đất <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formDetails.houseLandType}
                      onValueChange={(value) => handleFormDetailChange('houseLandType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại đất" />
                      </SelectTrigger>
                      <SelectContent>
                        {landTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Build Year */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Năm xây dựng <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      placeholder="VD: 2020"
                      value={formDetails.houseBuildYear}
                      onChange={(e) => handleFormDetailChange('houseBuildYear', e.target.value)}
                      min="1990"
                      max={new Date().getFullYear()}
                    />
                  </div>

                  {/* Position */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Vị trí <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formDetails.housePosition}
                      onValueChange={(value) => handleFormDetailChange('housePosition', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vị trí" />
                      </SelectTrigger>
                      <SelectContent>
                        {positionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Construction Level */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Cấp công trình <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formDetails.houseConstructionLevel}
                      onValueChange={(value) =>
                        handleFormDetailChange('houseConstructionLevel', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn cấp công trình" />
                      </SelectTrigger>
                      <SelectContent>
                        {constructionLevelOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Basement */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Tầng hầm</Label>
                    <Select
                      value={formDetails.houseBasement}
                      onValueChange={(value) => handleFormDetailChange('houseBasement', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tầng hầm" />
                      </SelectTrigger>
                      <SelectContent>
                        {basementOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Notary Location */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Lựa chọn địa điểm công chứng <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formDetails.notaryLocation}
                      onValueChange={(value) => handleFormDetailChange('notaryLocation', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn địa điểm công chứng" />
                      </SelectTrigger>
                      <SelectContent>
                        {notaryLocationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Custom Address for House and Land Sale */}
                {formDetails.notaryLocation === 'outside' && (
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Tỉnh/Thành phố <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formDetails.customAddress}
                        onValueChange={(value) => handleFormDetailChange('customAddress', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn tỉnh/thành phố" />
                        </SelectTrigger>
                        <SelectContent>
                          {addressOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {formDetails.customAddress && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Quận/Huyện <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formDetails.district}
                          onValueChange={(value) => handleFormDetailChange('district', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn quận/huyện" />
                          </SelectTrigger>
                          <SelectContent>
                            {districtOptions[
                              formDetails.customAddress as keyof typeof districtOptions
                            ]?.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Contract Amendment Form */}
            {selectedService === 'contract-amendment' && (
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6 bg-gray-50">
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <Building className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" />
                  Thông tin sửa đổi hợp đồng
                </h3>

                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Lựa chọn địa điểm công chứng <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formDetails.notaryLocation}
                      onValueChange={(value) => handleFormDetailChange('notaryLocation', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn địa điểm công chứng" />
                      </SelectTrigger>
                      <SelectContent>
                        {notaryLocationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Custom Address for Contract Amendment */}
                  {formDetails.notaryLocation === 'outside' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Tỉnh/Thành phố <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formDetails.customAddress}
                          onValueChange={(value) => handleFormDetailChange('customAddress', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn tỉnh/thành phố" />
                          </SelectTrigger>
                          <SelectContent>
                            {addressOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {formDetails.customAddress && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Quận/Huyện <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={formDetails.district}
                            onValueChange={(value) => handleFormDetailChange('district', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn quận/huyện" />
                            </SelectTrigger>
                            <SelectContent>
                              {districtOptions[
                                formDetails.customAddress as keyof typeof districtOptions
                              ]?.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Calculate Fee Button */}
                {isFormComplete() && !calculatedFees.isCalculated && (
                  <div className="mt-3 sm:mt-4 md:mt-6 text-center">
                    <Button
                      onClick={calculateTotalFees}
                      className="bg-primary hover:bg-primary/90 text-white font-semibold px-3 sm:px-6 md:px-8 py-2 sm:py-3 text-xs sm:text-sm md:text-base w-full sm:w-auto h-9 sm:h-10 md:h-11"
                    >
                      <Calculator className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2" />
                      <span className="hidden xs:inline">Tính phí công chứng</span>
                      <span className="xs:hidden">Tính phí</span>
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Apartment Contribution Form */}
            {selectedService === 'apartment-contribution' && (
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6 bg-gray-50">
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <Building className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" />
                  Thông tin góp vốn bằng căn hộ
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 space-y-3 sm:space-y-0">
                  {/* House Type */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Loại Nhà <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formDetails.houseType}
                      onValueChange={(value) => handleFormDetailChange('houseType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại nhà" />
                      </SelectTrigger>
                      <SelectContent>
                        {houseTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Area */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Diện tích nhà/m² <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      placeholder="VD: 80"
                      value={formDetails.area}
                      onChange={(e) => handleFormDetailChange('area', e.target.value)}
                      min="1"
                    />
                  </div>

                  {/* Notary Location */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Lựa chọn địa điểm công chứng <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formDetails.notaryLocation}
                      onValueChange={(value) => handleFormDetailChange('notaryLocation', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn địa điểm công chứng" />
                      </SelectTrigger>
                      <SelectContent>
                        {notaryLocationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Custom Address for Apartment Contribution */}
                {formDetails.notaryLocation === 'outside' && (
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Tỉnh/Thành phố <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formDetails.customAddress}
                        onValueChange={(value) => handleFormDetailChange('customAddress', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn tỉnh/thành phố" />
                        </SelectTrigger>
                        <SelectContent>
                          {addressOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {formDetails.customAddress && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Quận/Huyện <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formDetails.district}
                          onValueChange={(value) => handleFormDetailChange('district', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn quận/huyện" />
                          </SelectTrigger>
                          <SelectContent>
                            {districtOptions[
                              formDetails.customAddress as keyof typeof districtOptions
                            ]?.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )}

                {/* Calculate Fee Button */}
                {isFormComplete() && !calculatedFees.isCalculated && (
                  <div className="mt-3 sm:mt-4 md:mt-6 text-center">
                    <Button
                      onClick={calculateTotalFees}
                      className="bg-primary hover:bg-primary/90 text-white font-semibold px-3 sm:px-6 md:px-8 py-2 sm:py-3 text-xs sm:text-sm md:text-base w-full sm:w-auto h-9 sm:h-10 md:h-11"
                    >
                      <Calculator className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2" />
                      <span className="hidden xs:inline">Tính phí công chứng</span>
                      <span className="xs:hidden">Tính phí</span>
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Inheritance Division Form */}
            {selectedService === 'inheritance-division' && (
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6 bg-gray-50">
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <Building className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" />
                  Thông tin chia di sản thừa kế
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 space-y-3 sm:space-y-0">
                  {/* District */}
                  <div className="space-y-1 sm:space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-gray-700">
                      Quận/Huyện <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formDetails.landDistrict}
                      onValueChange={(value) => handleFormDetailChange('landDistrict', value)}
                    >
                      <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                        <SelectValue placeholder="Chọn quận/huyện" />
                      </SelectTrigger>
                      <SelectContent>
                        {districtOptions.hanoi.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-xs sm:text-sm"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Land Area */}
                  <div className="space-y-1 sm:space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-gray-700">
                      Diện tích đất/m² <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      placeholder="VD: 100"
                      value={formDetails.landArea}
                      onChange={(e) => handleFormDetailChange('landArea', e.target.value)}
                      min="1"
                      className="h-9 sm:h-10 text-xs sm:text-sm"
                    />
                  </div>

                  {/* Notary Location */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Lựa chọn địa điểm công chứng <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formDetails.notaryLocation}
                      onValueChange={(value) => handleFormDetailChange('notaryLocation', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn địa điểm công chứng" />
                      </SelectTrigger>
                      <SelectContent>
                        {notaryLocationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Custom Address for Inheritance Division */}
                {formDetails.notaryLocation === 'outside' && (
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Tỉnh/Thành phố <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formDetails.customAddress}
                        onValueChange={(value) => handleFormDetailChange('customAddress', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn tỉnh/thành phố" />
                        </SelectTrigger>
                        <SelectContent>
                          {addressOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {formDetails.customAddress && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Quận/Huyện <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formDetails.district}
                          onValueChange={(value) => handleFormDetailChange('district', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn quận/huyện" />
                          </SelectTrigger>
                          <SelectContent>
                            {districtOptions[
                              formDetails.customAddress as keyof typeof districtOptions
                            ]?.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )}

                {/* Calculate Fee Button */}
                {isFormComplete() && !calculatedFees.isCalculated && (
                  <div className="mt-3 sm:mt-4 md:mt-6 text-center">
                    <Button
                      onClick={calculateTotalFees}
                      className="bg-primary hover:bg-primary/90 text-white font-semibold px-3 sm:px-6 md:px-8 py-2 sm:py-3 text-xs sm:text-sm md:text-base w-full sm:w-auto h-9 sm:h-10 md:h-11"
                    >
                      <Calculator className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2" />
                      <span className="hidden xs:inline">Tính phí công chứng</span>
                      <span className="xs:hidden">Tính phí</span>
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Information Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3 md:p-4">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">i</span>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">
                    Thông tin hữu ích:
                  </h4>
                  <ul className="text-blue-700 text-xs space-y-1">
                    <li>• Kết quả tính phí chỉ mang tính tham khảo</li>
                    <li>• Phí thực tế có thể thay đổi theo quy định hiện hành</li>
                    <li>• Liên hệ trực tiếp để được tư vấn chi tiết</li>
                    <li>• Hỗ trợ tư vấn miễn phí 24/7</li>
                    <li>• Phí chưa bao gồm thuế VAT và các chi phí phát sinh khác</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-3 md:pt-4">
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-xs sm:text-sm md:text-base h-8 sm:h-9 md:h-10"
                asChild
              >
                <Link to="/contact">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Liên hệ tư vấn
                </Link>
              </Button>
              {/* <Button variant="outline" className="flex-1 text-sm sm:text-base" asChild>
                <Link to="/services">
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Xem bảng phí chi tiết
                </Link>
              </Button> */}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FloatingServiceButton;
