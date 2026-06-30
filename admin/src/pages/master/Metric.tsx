import { MasterCRUDTemplate, type FormField } from "@/components/master/MasterCRUDTemplate"

export default function Metric() {
  const fields: FormField[] = [
    { name: "metricName", label: "Metric Name", type: "text", required: true },
  ]

  const columns = [
    { field: "metricName", headerName: "Name", width: 200 },
  ]

  const endpoints = {
    get: "/product/metrics/getMetrics",
    add: "/product/metrics/addMetric",
    update: "/product/metrics/updateMetric/{id}",
    delete: "/product/metrics/deleteMetric/{id}",
  }

  return (
    <MasterCRUDTemplate
      title="Metrics"
      queryKey="metrics"
      endpoints={endpoints}
      fields={fields}
      gridColumns={columns}
      idField="metricId"
    />
  )
}
