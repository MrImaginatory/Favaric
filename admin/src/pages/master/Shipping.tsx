import { MasterCRUDTemplate, type FormField } from "@/components/master/MasterCRUDTemplate"

export default function Shipping() {
  const fields: FormField[] = [
    { name: "shippingBaseCountry", label: "Base Country", type: "text", required: true },
    { name: "shippingChargeCurrency", label: "Currency (e.g. USD, INR)", type: "text", required: true },
    { name: "shippingPrice", label: "Shipping Price", type: "number", required: true },
    { name: "isFreeShipping", label: "Free Shipping?", type: "boolean", required: false },
    { name: "shippingMinimumOrderAmount", label: "Min Order Amount for Free Shipping", type: "number", required: false },
    { name: "shippingWeightSlabFrom", label: "Weight Slab From (grams)", type: "number", required: false },
    { name: "shippingWeightSlabTo", label: "Weight Slab To (grams)", type: "number", required: false },
    { name: "shippingStatus", label: "Status (Active/Inactive)", type: "status_checkbox", required: false },
  ]

  const columns = [
    { field: "shippingBaseCountry", headerName: "Country", width: 200 },
    { field: "shippingPrice", headerName: "Price", width: 200 },
    { field: "shippingChargeCurrency", headerName: "Currency", width: 200 },
    {
      field: "isFreeShipping",
      headerName: "Free Shipping",
      width: 200,
      cellRenderer: (params: any) => (params.value ? "Yes" : "No"),
    },
    { field: "shippingStatus", headerName: "Status", width: 200 },
  ]

  const endpoints = {
    get: "/product/shippingCharges/getAllShippingCharges",
    add: "/product/shippingCharges/addShippingCharge",
    update: "/product/shippingCharges/updateShippingCharge/{id}",
    delete: "/product/shippingCharges/deleteShippingCharge/{id}",
  }

  return (
    <MasterCRUDTemplate
      title="Shipping Charges"
      queryKey="shippingCharges"
      endpoints={endpoints}
      fields={fields}
      gridColumns={columns}
      idField="shippingChargeId"
    />
  )
}

