import { MasterCRUDTemplate, type FormField } from "@/components/master/MasterCRUDTemplate"

export default function CountryOfOrigin() {
  const fields: FormField[] = [
    { name: "countryOfOriginName", label: "Country Name", type: "text", required: true },
    { name: "countryOfOriginDescription", label: "Description", type: "richtext",
      maxLength: 255, required: false },
  ]

  const columns = [
    { field: "countryOfOriginName", headerName: "Name", width: 200 },
    { field: "countryOfOriginDescription", headerName: "Description", width: 400 },
  ]

  const endpoints = {
    get: "/product/countries/getCountries",
    add: "/product/countries/addCountry",
    update: "/product/countries/updateCountry/{id}",
    delete: "/product/countries/deleteCountry/{id}",
  }

  return (
    <MasterCRUDTemplate
      title="Country Of Origin"
      queryKey="countries"
      endpoints={endpoints}
      fields={fields}
      gridColumns={columns}
      idField="countryOfOriginId"
    />
  )
}

