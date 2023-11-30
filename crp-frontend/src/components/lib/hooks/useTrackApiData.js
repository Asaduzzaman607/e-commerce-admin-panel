import {
    goalsActiveUserComparison,
    lastHourVisitor,
    pageViewsEndPoint,
    sessionTimeComparison,
    sourceAnalyticComparison
} from "../../../services/ApiEndPointService";
import axios from "axios";
import {notifyResponseError} from "../common/notifications";
import {Form} from "antd";
import {useState} from "react";


export default function useTrackApiData() {
    const [form] = Form.useForm();
    const [collection, setCollection] = useState([]);
    const [sessionTime, setSessionTime] = useState([]);
    const [goalActiveUser, setGoalActiveUser] = useState([]);
    const [sourceAnalytic, setSourceAnalytic] = useState([]);
    const [pageViews, setPageViews] = useState([]);


    const handleLastVisitor = async () => {

        try {
            const { data } = await axios.get(lastHourVisitor, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer  + ${process.env.ACCESS_JWT_SECRET_TRACK_API}`
                },
            });
            setCollection(data?.data);
        } catch (er) {
            notifyResponseError(er);
        }
    };
    const handleSessionTimeComparison = async () => {
        try {
            const { data } = await axios.get(sessionTimeComparison, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer  + ${process.env.ACCESS_JWT_SECRET_TRACK_API}`
                },
            });
            setSessionTime(data?.data);
        } catch (er) {
            notifyResponseError(er);
        }
    };

    const handlePageViews = async () => {
        try {
            const { data } = await axios.get(pageViewsEndPoint, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer  + ${process.env.ACCESS_JWT_SECRET_TRACK_API}`
                },
            });
            setPageViews(data?.data);
        } catch (er) {
            notifyResponseError(er);
        }
    };


    const handleGoalsActiveUserComparison = async () => {
        try {
            const { data } = await axios.get(goalsActiveUserComparison, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer  + ${process.env.ACCESS_JWT_SECRET_TRACK_API}`
                },
            });
            setGoalActiveUser(data?.data);
        } catch (er) {
            notifyResponseError(er);
        }
    };
    const handleSourceAnalyticComparison = async () => {
        try {
            const { data } = await axios.get(sourceAnalyticComparison, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer  + ${process.env.ACCESS_JWT_SECRET_TRACK_API}`
                },
            });
            setSourceAnalytic(data?.data);
        } catch (er) {
            notifyResponseError(er);
        }
    };


    return {
        form,
        handleLastVisitor,
        collection,
        handleSessionTimeComparison,
        sessionTime,
        handleGoalsActiveUserComparison,
        goalActiveUser,
        handleSourceAnalyticComparison,
        sourceAnalytic,
        handlePageViews,
        pageViews
    };
}


