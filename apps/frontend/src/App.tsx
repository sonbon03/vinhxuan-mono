import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import UserListPage from './pages/users/UserListPage';
import UserCreatePage from './pages/users/UserCreatePage';
import UserEditPage from './pages/users/UserEditPage';
import UserDetailPage from './pages/users/UserDetailPage';
import EmployeeListPage from './pages/employees/EmployeeListPage';
import EmployeeCreatePage from './pages/employees/EmployeeCreatePage';
import EmployeeEditPage from './pages/employees/EmployeeEditPage';
import EmployeeDetailPage from './pages/employees/EmployeeDetailPage';
import ServiceListPage from './pages/services/ServiceListPage';
import ServiceCreatePage from './pages/services/ServiceCreatePage';
import ServiceEditPage from './pages/services/ServiceEditPage';
import ServiceDetailPage from './pages/services/ServiceDetailPage';
import CategoryListPage from './pages/categories/CategoryListPage';
import CategoryCreatePage from './pages/categories/CategoryCreatePage';
import CategoryEditPage from './pages/categories/CategoryEditPage';
import CategoryDetailPage from './pages/categories/CategoryDetailPage';
import DocumentGroupListPage from './pages/document-groups/DocumentGroupListPage';
import DocumentGroupCreatePage from './pages/document-groups/DocumentGroupCreatePage';
import DocumentGroupEditPage from './pages/document-groups/DocumentGroupEditPage';
import FeeTypeListPage from './pages/fee-types/FeeTypeListPage';
import FeeTypeCreatePage from './pages/fee-types/FeeTypeCreatePage';
import FeeTypeEditPage from './pages/fee-types/FeeTypeEditPage';
import FeeCalculatorPage from './pages/fee-calculator/FeeCalculatorPage';
import FeeCalculationHistoryPage from './pages/fee-calculator/FeeCalculationHistoryPage';
import RecordListPage from './pages/records/RecordListPage';
import RecordCreatePage from './pages/records/RecordCreatePage';
import RecordEditPage from './pages/records/RecordEditPage';
import RecordDetailPage from './pages/records/RecordDetailPage';
import ArticleListPage from './pages/articles/ArticleListPage';
import ArticleCreatePage from './pages/articles/ArticleCreatePage';
import ArticleEditPage from './pages/articles/ArticleEditPage';
import ArticleDetailPage from './pages/articles/ArticleDetailPage';
import ListingListPage from './pages/listings/ListingListPage';
import ListingCreatePage from './pages/listings/ListingCreatePage';
import ListingEditPage from './pages/listings/ListingEditPage';
import ListingDetailPage from './pages/listings/ListingDetailPage';
import ConsultationListPage from './pages/consultations/ConsultationListPage';
import ConsultationCreatePage from './pages/consultations/ConsultationCreatePage';
import ConsultationDetailPage from './pages/consultations/ConsultationDetailPage';
import EmailCampaignListPage from './pages/email-campaigns/EmailCampaignListPage';
import EmailCampaignCreatePage from './pages/email-campaigns/EmailCampaignCreatePage';
import EmailCampaignEditPage from './pages/email-campaigns/EmailCampaignEditPage';
import EmailCampaignDetailPage from './pages/email-campaigns/EmailCampaignDetailPage';
import ChatHistoryPage from './pages/chatbot/ChatHistoryPage';
import StatisticsOverviewPage from './pages/statistics/StatisticsOverviewPage';
import RecordStatisticsPage from './pages/statistics/RecordStatisticsPage';
import UserStatisticsPage from './pages/statistics/UserStatisticsPage';
import PerformanceStatisticsPage from './pages/statistics/PerformanceStatisticsPage';
import RevenueStatisticsPage from './pages/statistics/RevenueStatisticsPage';
import MyAnnouncementsPage from './pages/dashboard/MyAnnouncementsPage';
import MyConsultationsPage from './pages/dashboard/MyConsultationsPage';
import ProtectedRoute from './components/ProtectedRoute';
import ChatWidget from './components/ChatWidget';
import MainLayout from './layouts/MainLayout';
import { UserRole } from '@/types';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ChatWidget />
        <Routes>
          {/* Auth routes - NO layout */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* All other routes use MainLayout */}
          <Route element={<MainLayout />}>
            {/* Public routes - accessible without authentication */}
            <Route path="/fee-calculator" element={<FeeCalculatorPage />} />
            <Route path="/articles" element={<ArticleListPage />} />
            <Route path="/articles/:id" element={<ArticleDetailPage />} />
            <Route path="/listings" element={<ListingListPage />} />
            <Route path="/listings/:id" element={<ListingDetailPage />} />

            {/* Protected routes - require authentication */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER]} />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/fee-calculator/history" element={<FeeCalculationHistoryPage />} />
              <Route path="/my-announcements" element={<MyAnnouncementsPage />} />
              <Route path="/my-consultations" element={<MyConsultationsPage />} />
              <Route path="/listings/create" element={<ListingCreatePage />} />
              <Route path="/listings/edit/:id" element={<ListingEditPage />} />
              <Route path="/consultations/create" element={<ConsultationCreatePage />} />
              <Route path="/consultations/:id" element={<ConsultationDetailPage />} />
            </Route>

            {/* Protected routes - require authentication as ADMIN or STAFF (NO CUSTOMER ACCESS) */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]} />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/records" element={<RecordListPage />} />
              <Route path="/records/create" element={<RecordCreatePage />} />
              <Route path="/records/edit/:id" element={<RecordEditPage />} />
              <Route path="/records/:id" element={<RecordDetailPage />} />
              <Route path="/consultations" element={<ConsultationListPage />} />

              {/* Admin and Staff only routes */}
              <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]} />}>
                <Route path="/users" element={<UserListPage />} />
                <Route path="/users/:id" element={<UserDetailPage />} />
                <Route path="/services" element={<ServiceListPage />} />
                <Route path="/services/:id" element={<ServiceDetailPage />} />
                <Route path="/services/create" element={<ServiceCreatePage />} />
                <Route path="/services/edit/:id" element={<ServiceEditPage />} />
                <Route path="/categories" element={<CategoryListPage />} />
                <Route path="/categories/:id" element={<CategoryDetailPage />} />
                <Route path="/categories/create" element={<CategoryCreatePage />} />
                <Route path="/categories/edit/:id" element={<CategoryEditPage />} />
                <Route path="/document-groups" element={<DocumentGroupListPage />} />
                <Route path="/document-groups/create" element={<DocumentGroupCreatePage />} />
                <Route path="/document-groups/edit/:id" element={<DocumentGroupEditPage />} />
                <Route path="/fee-types" element={<FeeTypeListPage />} />
                <Route path="/fee-types/create" element={<FeeTypeCreatePage />} />
                <Route path="/fee-types/edit/:id" element={<FeeTypeEditPage />} />
                <Route path="/articles/create" element={<ArticleCreatePage />} />
                <Route path="/articles/edit/:id" element={<ArticleEditPage />} />
                <Route path="/email-campaigns" element={<EmailCampaignListPage />} />
                <Route path="/email-campaigns/create" element={<EmailCampaignCreatePage />} />
                <Route path="/email-campaigns/edit/:id" element={<EmailCampaignEditPage />} />
                <Route path="/email-campaigns/:id" element={<EmailCampaignDetailPage />} />
                <Route path="/chatbot/history" element={<ChatHistoryPage />} />
                <Route path="/statistics" element={<StatisticsOverviewPage />} />
                <Route path="/statistics/overview" element={<StatisticsOverviewPage />} />
                <Route path="/statistics/records" element={<RecordStatisticsPage />} />
                <Route path="/statistics/users" element={<UserStatisticsPage />} />
                <Route path="/statistics/performance" element={<PerformanceStatisticsPage />} />
                <Route path="/statistics/revenue" element={<RevenueStatisticsPage />} />
              </Route>

              {/* Admin only routes */}
              <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
                <Route path="/users/create" element={<UserCreatePage />} />
                <Route path="/users/:id/edit" element={<UserEditPage />} />
                <Route path="/employees" element={<EmployeeListPage />} />
                <Route path="/employees/:id" element={<EmployeeDetailPage />} />
                <Route path="/employees/create" element={<EmployeeCreatePage />} />
                <Route path="/employees/:id/edit" element={<EmployeeEditPage />} />
              </Route>
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
