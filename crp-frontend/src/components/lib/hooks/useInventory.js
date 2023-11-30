// import { useCallback, useState } from "react";
// import axios from "axios";

// export function useInventory() {
//   const [inventory, setInventory] = useState({
//     brand: [],
//     category: [],
//     subcategory: [],
//     location: [],
//   });

//   const initCategory = useCallback(async () => {
//     const { data } = await axios.get( "https://core.shoplover.com/sll/v1/states");
//     const newCategoryData = data.data.map(({ category_id, name }) => ({
//       category_id,
//       name,
//     }));
//     setInventory((prev) => ({
//       ...prev,
//       category: newCategoryData,
//     }));
//   }, []);
  

//   return {
//     inventory,
//     initCategory,
//   };
// }

import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import { notifyResponseError } from "../common/notifications";
import {getJWTToken} from "../common/auth/authHelper";
import { useNavigate } from "react-router-dom";


// Add an Axios request interceptor to include the JWT token
axios.interceptors.request.use((config) => {
    const token = getJWTToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export function useResource(endpoint) {
    const [data, setData] = useState([]);
    const navigate = useNavigate()
    const initData = useCallback(
        async (fieldNames, parent_id = null) => { // Add created_at as a parameter
            try {
                const response = await axios.get(endpoint,{ params: { parent_id: parent_id } });
                const extractedData = response.data.data.map((item) => {
                    const extractedFields = {};
                    for (const fieldName of fieldNames) {
                        if (item.hasOwnProperty(fieldName)) {
                            extractedFields[fieldName] = item[fieldName];
                        }
                    }
                    return extractedFields;
                });
                setData(extractedData);
            } catch (error) {
                if(error.response.status===401){
                    navigate("/login");
                }
                notifyResponseError(error);
            }
        },
        [endpoint]
    );

    return { data, initData };
}

export function useResourceForPost(endpoint) {
    const [data, setData] = useState([]);

    const initData = useCallback(
        async (fieldNames, body) => { // Add body as a parameter
            try {
                const response = await axios.post(endpoint, body);
                const extractedData = response.data.data.map((item) => {
                    const extractedFields = {};
                    for (const fieldName of fieldNames) {
                        if (item.hasOwnProperty(fieldName)) {
                            extractedFields[fieldName] = item[fieldName];
                        }
                    }
                    return extractedFields;
                });
                setData(extractedData);
            } catch (error) {
                notifyResponseError(error);
            }
        },
        [endpoint]
    );

    return { data, initData };
}


export function useResourceForPostObject(endpoint) {
    const [data, setData] = useState({});

    const initData = useCallback(
        async (fieldNames, body) => {
            try {
                const response = await axios.post(endpoint, body);
                const responseData = response.data.data;

                if (typeof responseData === 'object' && !Array.isArray(responseData)) {
                    const extractedFields = {};
                    for (const fieldName of fieldNames) {
                        if (responseData.hasOwnProperty(fieldName)) {
                            extractedFields[fieldName] = responseData[fieldName];
                        }
                    }
                    setData(extractedFields);
                } else {
                    console.error('Invalid response data format');
                }
            } catch (error) {
                notifyResponseError(error);
            }
        },
        [endpoint]
    );

    return { data, initData };
}


export function useResource2(endpoint) {
  const [data, setData] = useState([]);

  const initData = useCallback(
      async (fieldNames, created_at) => { // Add created_at as a parameter

          try {
              const response = await axios.get(`${endpoint}?filter={"created_at":${created_at}}`);
              const extractedData = response.data.data.map((item) => {
                  const extractedFields = {};
                  for (const fieldName of fieldNames) {
                      if (item.hasOwnProperty(fieldName)) {
                          extractedFields[fieldName] = item[fieldName];
                      }
                  }
                  return extractedFields;
              });
              setData(extractedData);
          } catch (error) {
              notifyResponseError(error);
          }
      },
      [endpoint]
  );

  return { data, initData };
}

export function useResource3(endpoint) {
    const [data, setData] = useState([]);

    const initData = useCallback(
        async (fieldNames,created_at) => { // Add created_at as a parameter

            try {
                const response = await axios.get(`${endpoint}?filter={"created_at":${created_at}}&&orderBy={"periodic_gmv_bdt":"desc"}`);
                const extractedData = response.data.data.map((item) => {
                    const extractedFields = {};
                    for (const fieldName of fieldNames) {
                        if (item.hasOwnProperty(fieldName)) {
                            extractedFields[fieldName] = item[fieldName];
                        }
                    }
                    return extractedFields;
                });
                setData(extractedData);
            } catch (error) {
                notifyResponseError(error);
            }
        },
        [endpoint]
    );

    return { data, initData };
}

export function useResource4(endpoint) {
    const [data, setData] = useState({});

    const initData = useCallback(
        async (fieldNames, created_at) => { // Add created_at as a parameter

            try {
                const response = await axios.get(`${endpoint}?filter={"created_at":${created_at}}`);
                console.log({response})
                setData(response?.data);
            } catch (error) {
                notifyResponseError(error);
            }
        },
        [endpoint]
    );

    return { data, initData };
}

