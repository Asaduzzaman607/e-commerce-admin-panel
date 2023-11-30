import './App.css';
import logo from './assets/images/logo.svg'
import {Route, Routes, useNavigate} from 'react-router-dom';
import {AppProvider} from "./contexts/apps";
import {useState} from "react";
import DataTable from "./components/salesReport/DistrictWiseSalesReport";
import Dashboard from "./components/dashboard/Dashboard";
import {Users} from "./components/users/Users";
import CommercialReport from './components/commercialReport/CommercialReport';
import DeliveryReport from './components/deliveryReport/DeliveryReport';
import AccountingReport from './components/accountReport/AccountingReport';
import InventoryReport from './components/inventoryReport/InventoryReport';
import Login from "./components/auth/Login";
import OrderToDeliveryTime from './components/deliveryReport/OrderToDeliveryTime';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PaymentChannelReport from './components/payment/PaymentChannelReport';
import CustomersHistoryReport from "./components/CustomersReport/CustomersHistoryReport";
import { removeUser } from './redux/reducers/user.reducer';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SalesReport from "./components/salesReport/SalesReport";
import AuthAPI from "./services/authService/AuthAPI";
import CategoryWiseSalesReport from './components/salesReport/CategoryWiseSalesReport';
import CategoryWiseSalesReportSummary from "./components/salesReport/CategoryWiseSalesReportSummary";
import SellerWiseSalesReport from "./components/salesReport/SellerWIseSalesReport";
import DistrictWiseSalesReport from "./components/salesReport/DistrictWiseSalesReport";
import ProductStock from './components/inventoryReport/ProductStock';
import TopCategoriesReport from "./components/commercialReport/TopCategoriesReport";
import OutsideInsideDhaka from './components/commercialReport/OutsideInsideDhaka';
import MonthlyUserAnalytics from "./components/commercialReport/MonthlyUserAnalytics";

const HTTP_UNAUTHORIZED = 401

function App() {

    const [collapsed, setCollapsed] = useState(true);
    const contextValue = {collapsed, setCollapsed, logo}
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { data } = useSelector(state => state.user);


    const parseJwt = (token) => {
        try {
          return JSON.parse(atob(token.split(".")[1]));
        } catch (e) {
          return null;
        }
    };

    useEffect(() => {
        const storedUser = data?.access_token;
        if (storedUser) {
            const decodedJwt = parseJwt(storedUser);
            if (decodedJwt.exp * 1000 < Date.now()) {
                dispatch(removeUser());
                localStorage.clear();
                navigate('/login');
            }
        }
    }, []);

    useEffect(() => {
        const responseInterceptor = AuthAPI.interceptors.response.use((res) => {
            return res;
        },
          (error) => {
            if (error.response.status === HTTP_UNAUTHORIZED) {
              dispatch(removeUser());
              localStorage.clear();
              navigate("/login");
              return;
            }
            return Promise.reject(error);
          }
        );
        return () => {
            AuthAPI.interceptors.response.eject(responseInterceptor);
        };
    }, [dispatch, navigate]);

    return (
        <AppProvider value={contextValue}>
            <Routes>
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
                <Route path="/user" element={<ProtectedRoute><Users/></ProtectedRoute>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/sales-report-1" element={<ProtectedRoute><DataTable/></ProtectedRoute>}/>
                <Route path="/customers-history-report" element={<ProtectedRoute><CustomersHistoryReport/></ProtectedRoute>}/>
                <Route path="/sales-report" element={<ProtectedRoute><SalesReport/></ProtectedRoute>}/>
                <Route path="/delivery-reports" element={<DeliveryReport/>}/>
                <Route path="/top-categories--report" element={<ProtectedRoute><TopCategoriesReport/></ProtectedRoute>}/>
                <Route path="/commercial-report" element={<ProtectedRoute><CommercialReport/></ProtectedRoute>}/>
                <Route path="/accounting-report" element={<ProtectedRoute><AccountingReport/></ProtectedRoute>}/>
                <Route path="/inventory-report" element={<ProtectedRoute><InventoryReport/></ProtectedRoute>}/>
                <Route path="/order-to-delivery-time" element={<ProtectedRoute><OrderToDeliveryTime/></ProtectedRoute>}/>
                <Route path="/payment-channel-report" element={<ProtectedRoute><PaymentChannelReport/></ProtectedRoute>}/>
                <Route path="/category-wise-sales-summary-report" element={<ProtectedRoute><CategoryWiseSalesReportSummary/></ProtectedRoute>}/>
                <Route path="/category-wise-sales-report" element={<ProtectedRoute><CategoryWiseSalesReport/></ProtectedRoute>}/>
                <Route path="/seller-wise-sales-report" element={<ProtectedRoute><SellerWiseSalesReport/></ProtectedRoute>}/>
                <Route path="/district-wise-sales-report" element={<ProtectedRoute><DistrictWiseSalesReport/></ProtectedRoute>}/>
                <Route path="/product-stock-report" element={<ProtectedRoute><ProductStock/></ProtectedRoute>}/>
                <Route path="/inside-outside-dhaka-report" element={<ProtectedRoute><OutsideInsideDhaka/></ProtectedRoute>}/>
                <Route path="/monthly_active_users_analytics" element={<ProtectedRoute><MonthlyUserAnalytics/></ProtectedRoute>}/>
            </Routes>
        </AppProvider>
    );
}

export default App;
