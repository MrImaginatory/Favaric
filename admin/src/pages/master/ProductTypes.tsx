import { MasterCRUDTemplate, type FormField } from "@/components/master/MasterCRUDTemplate"

export default function ProductTypes() {
  const fields: FormField[] = [
    { name: "productTypeName", label: "Product Type Name", type: "text", required: true },
    { name: "productTypeDescription", label: "Description", type: "richtext",
      maxLength: 255, required: false },
  ]

  const columns = [
    { field: "productTypeName", headerName: "Name", width: 200 },
    { field: "productTypeDescription", headerName: "Description", width: 400 },
  ]

  const endpoints = {
    get: "/product/productTypes/getAllProductTypes",
    add: "/product/productTypes/addProductType",
    update: "/product/productTypes/updateProductType/{id}",
    delete: "/product/productTypes/deleteProductType/{id}",
  }

  return (
    <MasterCRUDTemplate
      title="Product Type"
      queryKey="productTypes"
      endpoints={endpoints}
      fields={fields}
      gridColumns={columns}
      idField="productTypeId"
    />
  )
}

