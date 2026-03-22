import { Navigate } from "react-router-dom";

export default function DeliveryOrdersFilterEntry() {
  return <Navigate to="/driver/jobs/list?category=delivery" replace />;
}
