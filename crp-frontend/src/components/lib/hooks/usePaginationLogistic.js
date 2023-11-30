import { Form } from "antd";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  paginationObjectTemplate,
  setPagination,
} from "../../../redux/reducers/paginate.reducers";
import {
  insideOutsideDhakaEndpoint,
  logisticApiKey,
} from "../../../services/ApiEndPointService";

import { getJWTToken } from "../common/auth/authHelper";
import { CustomDateRangeChecker } from "../common/CustomDateRangeChecker";
import { notifyResponseError } from "../common/notifications";

const logisticAPI = axios.create({
  baseURL: insideOutsideDhakaEndpoint,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

logisticAPI.interceptors.request.use(function (config) {
  config.headers.Authorization = `Bearer ${getJWTToken()}`;
  return config;
});

const paginationSelector = (key) => (state) => {
  if (state.pagination && state.pagination.hasOwnProperty(key)) {
    return state.pagination[key];
  }
  return paginationObjectTemplate;
};

export const refreshPagination = (key, url) => async (dispatch, getState) => {
  const state = getState();
  const obj = paginationSelector(key)(state);
  const { model, ...params } = obj;
  dispatch(fetchPagination(key, url, params));
};

export const fetchPagination = (key, url, params) => async (dispatch) => {
  try {
    const response = await logisticAPI.post(url, {
      rows_per_page: params.per_page,
      page_no: params.page,
      ...params,
    });
    dispatch(
      setPagination({
        key,
        data: response.data.data,
        meta_data: { ...response.data.meta_data },
        summary: response.data.summary,
      })
    );
  } catch (e) {
    notifyResponseError(e);
  }
};

export function usePaginateLogistic(key, url) {
  const dispatch = useDispatch();
  const jsonData = useSelector(paginationSelector(key));
  const [form] = Form.useForm();
  const [sizeForm] = Form.useForm();
  const { model: collection, metaData, summary } = jsonData;
  const { current_page: page, per_page, total_data, total_page } = metaData;

  const getSizeValue = (size) => {
    const formValues = form.getFieldsValue();
    const values = CustomDateRangeChecker(formValues);
    fetchData({ rows_per_page: size, ...values, api_key: logisticApiKey });
  };

  const paginate = (newPage, newPerPage) => {
    const formValues = form.getFieldsValue();
    const values = CustomDateRangeChecker(formValues);
    fetchData({
      page_no: newPage,
      rows_per_page: newPerPage,
      api_key: logisticApiKey,
      ...values,
    });
  };

  const fetchData = (params = {}) => {
    const data = {
      ...params,
    };
    dispatch(fetchPagination(key, url, data));
  };

  const resetFilter = () => {
    form.resetFields();
    fetchData({
      page_no: 1,
    });
  };

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
    sizeForm,
    getSizeValue,
    per_page: Number(per_page),
  };
}
