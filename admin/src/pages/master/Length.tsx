import { MasterCRUDTemplate, type FormField } from "@/components/master/MasterCRUDTemplate"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"

export default function Length() {
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
    { name: "lengthName", label: "Length Name", type: "text", required: true },
    { name: "lengthValue", label: "Value", type: "number", required: true },
    { name: "metricId", label: "Metric Unit", type: "select", required: true, options: metricOptions },
  ]

  const columns = [
    { field: "lengthName", headerName: "Name", width: 200 },
    { field: "lengthValue", headerName: "Value", width: 150 },
    { field: "metric.metricName", headerName: "Metric", width: 150 },
  ]

  const endpoints = {
    get: "/product/lengths/getAllLengths",
    add: "/product/lengths/addLength",
    update: "/product/lengths/updateLength/{id}",
    delete: "/product/lengths/deleteLength/{id}",
  }

  return (
    <MasterCRUDTemplate
      title="Length"
      queryKey="lengths"
      endpoints={endpoints}
      fields={fields}
      gridColumns={columns}
      idField="lengthId"
    />
  )
}
