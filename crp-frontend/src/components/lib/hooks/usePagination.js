import {Form} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {deleteKey, paginationObjectTemplate, setPagination} from "../../../redux/reducers/paginate.reducers";
import API from "../../../services/apiService/API";
import dayjs from "dayjs";
import AuthAPI from "../../../services/authService/AuthAPI";


const paginationSelector = (key) => (state) => {
    if (state.pagination && state.pagination.hasOwnProperty(key)) {
        return state.pagination[key];
    }
    return paginationObjectTemplate;
};

export const refreshPagination = (key, url) => async (dispatch, getState) => {
    const state = getState();
    const obj = paginationSelector(key)(state);
    const {model, ...params} = obj;
    dispatch(fetchPagination(key, url, params));
};

export const fetchPagination = (key, url, params, submittedForm, size) => async (dispatch) => {
    try {
        const response = await API.get(url, {
            params: {
                per_page: params.per_page,
                page: params.page,
            },
        });
        // Dispatch the response data to the Redux store
        dispatch(setPagination({
            key,
            data: response.data.data,
            meta_data: {...response.data.meta_data},
            summary: response.data.summary
        }));
    } catch (e) {
        console.error('Error:', e);
    }
};

export const fetchUsersPagination = (key, url, params, submittedForm, size) => async (dispatch) => {
    try {
        const response = await AuthAPI.get(url, {
            params: {
                per_page: params.per_page,
                page: params.page,
            },
        });
        // Dispatch the response data to the Redux store
        dispatch(setPagination({
            key,
            data: response.data.data,
            meta_data: {...response.data.meta_data},
            summary: response.data.summary
        }));
    } catch (e) {
        console.error('Error:', e);
    }
};

export function usePaginate(key, urlTemplate) {

    const dispatch = useDispatch();
    const jsonData = useSelector(paginationSelector(key));
    const [form] = Form.useForm();
    const [sizeForm] = Form.useForm();
    const {model: collection, metaData, summary} = jsonData;
    const {current_page: page, per_page, total_data, total_page} = metaData

    const getSizeValue = (size) => {
        const formValues = form.getFieldsValue();
        fetchData({per_page: size, ...formValues});
    }

    const paginate = (newPage, newPerPage) => {
        const formValues = form.getFieldsValue();
        fetchData({page: newPage, per_page: newPerPage, ...formValues});
    };

    const fetchData = (params = {}) => {
        const formValues = form.getFieldsValue();
        const filters = {};
        let selectedDateRange = [];

        if (formValues.created_at === 'today') {
            // Set the date range for today (equals)
            selectedDateRange = [dayjs(), dayjs()];
        } else if (formValues.created_at === 'last') {
            // Set the date range for yesterday (equals)
            selectedDateRange = [dayjs().subtract(1, 'day'), dayjs().subtract(1, 'day')];
        } else if (formValues.created_at === 'lastWeek') {
            // Set the date range for last week (gte and lte)
            selectedDateRange = [dayjs().subtract(1, 'week'), dayjs()];
        } else if (formValues.created_at === 'lastMonth') {
            // Set the date range for last month (gte and lte)
            selectedDateRange = [dayjs().subtract(1, 'month'), dayjs()];
        } else if (formValues.created_at === 'custom' && formValues.customDateRange) {
            // Use custom date range if 'custom' is selected
            selectedDateRange = formValues.customDateRange;
        }

        // Check if selectedDateRange has valid values
        if (selectedDateRange[0] && selectedDateRange[1]) {
            if (formValues.created_at === 'today') {
                const today = new Date();
                filters.created_at = {
                    gte: selectedDateRange[0].format('YYYY-MM-DD') + 'T00:00:00.000Z',
                    lte: today.toISOString(),
                };
            } else if (formValues.created_at === 'last') {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);

                filters.created_at = {
                    gte: yesterday.toISOString().split('T')[0] + 'T00:00:00.000Z',
                    lte: today.toISOString(),
                };
            } else {
                filters.created_at = {
                    gte: selectedDateRange[0].toISOString(),
                    lte: selectedDateRange[1].toISOString()
                };
            }
        }

        // Loop through formValues to create filters for other fields
        Object.keys(formValues).forEach((key) => {
            const value = formValues[key];

            if (value !== '' && key !== 'date' && key !== 'customDateRange' && key !== 'created_at') {
                if (key === 'payment_status') {
                    // Handle payment_status filter without "contains"
                    filters.payment_status = value;
                } else if (key === 'payment_type' && value === 'sslcommerz') {
                    filters['OR'] = [{payment_type: 'sslcommerz'}, {payment_type: 'sslcommerz_payment'}];
                } else if (key === 'shop') {
                    // Handle payment_status filter without "contains"
                    filters[key] = {name: value};
                } else {
                    // Handle other filters
                    filters[key] = {contains: value};
                }
            }
        });

        // Construct the URL template

        let constructedUrl = urlTemplate;
        if (Object.keys(filters).length > 0) {
            constructedUrl += `?filter=${encodeURIComponent(JSON.stringify(filters))}`;
        }


        if (key === 'users') {
            dispatch(fetchUsersPagination(key, constructedUrl, params));
        } else {
            dispatch(fetchPagination(key, constructedUrl, params));
        }
    };


    const deleteReduxKey = () => {
        dispatch(deleteKey({key}));
    };

    const resetFilter = () => {
        form.resetFields();
        fetchData({
            page: 1,
        });
    };
    //
    // useEffect(() => {
    //     form.setFieldsValue({ ...initialValues });
    //     fetchData(initialValues);
    // }, []);

    // useEffect(() => {
    //     const {model, ...rest} = jsonData;
    //     form.setFieldsValue({...rest});
    //     dispatch(fetchPagination(key, urlTemplate, {...rest, ...initialValues}));
    // }, []);

    return {
        form,
        fetchData,
        paginate,
        collection,
        summary,
        page,
        total_page,
        total_data,
        refreshPagination,
        resetFilter,
        deleteReduxKey,
        sizeForm,
        getSizeValue,
        per_page: Number(per_page),
    };
}