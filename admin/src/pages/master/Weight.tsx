import { MasterCRUDTemplate, type FormField } from "@/components/master/MasterCRUDTemplate"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"

export default function Weight() {
  const { data: metricsList = [] } = useQuery({
    queryKey: ["metrics"],
    queryFn: async () => {
      const res = await apiClient.get("/product/metrics/getMetrics")
      const payload = res.data?.data || res.data;
      return payload?.records || payload || []
    }
  })

  const metricOptions = (Array.isArray(metricsList) ? metricsList : []).map((m: any) => ({
    label: m.metricName,
    value: m.metricId,
  }))

  const fields: FormField[] = [
    { name: "weightName", label: "Weight Name", type: "text", required: true },
    { name: "weightValue", label: "Weight Value", type: "number", required: true },
    { name: "metricId", label: "Metric Unit", type: "select", required: true, options: metricOptions },
  ]

  const columns = [
    { field: "weightName", headerName: "Name", width: 200 },
    { field: "weightValue", headerName: "Value", width: 150 },
    { field: "metric.metricName", headerName: "Metric", width: 150 },
  ]

  const endpoints = {
    get: "/product/weights/getAllWeights",
    add: "/product/weights/addWeight",
    update: "/product/weights/updateWeight/{id}",
    delete: "/product/weights/deleteWeight/{id}",
  }

  return (
    <MasterCRUDTemplate
      title="Weight"
      queryKey="weights"
      endpoints={endpoints}
      fields={fields}
      gridColumns={columns}
      idField="weightId"
    />
  )
}
