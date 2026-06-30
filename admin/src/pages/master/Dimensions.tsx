import { MasterCRUDTemplate, type FormField } from "@/components/master/MasterCRUDTemplate"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"

export default function Dimensions() {
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
    { name: "dimensionName", label: "Dimension Name", type: "text", required: true },
    { name: "dimensionDescription", label: "Description", type: "richtext", required: false },
    { name: "dimensionLength", label: "Length", type: "number", required: true },
    { name: "dimensionBreadth", label: "Breadth", type: "number", required: true },
    { name: "dimensionHeight", label: "Height", type: "number", required: true },
    { name: "metricId", label: "Metric Unit", type: "select", required: true, options: metricOptions },
  ]

  const columns = [
    { field: "dimensionName", headerName: "Name", width: 200 },
    { field: "dimensionDescription", headerName: "Description", width: 400 },
    { field: "dimensionLength", headerName: "Length", width: 100 },
    { field: "dimensionBreadth", headerName: "Breadth", width: 100 },
    { field: "dimensionHeight", headerName: "Height", width: 100 },
    { field: "metric.metricName", headerName: "Metric", width: 150 },
  ]

  const endpoints = {
    get: "/product/dimensions/getAllDimensions",
    add: "/product/dimensions/addDimension",
    update: "/product/dimensions/updateDimension/{id}",
    delete: "/product/dimensions/deleteDimension/{id}",
  }

  return (
    <MasterCRUDTemplate
      title="Dimensions"
      queryKey="dimensions"
      endpoints={endpoints}
      fields={fields}
      gridColumns={columns}
      idField="dimensionId"
    />
  )
}
