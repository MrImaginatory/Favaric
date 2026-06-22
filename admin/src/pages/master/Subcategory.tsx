import { useQuery } from "@tanstack/react-query"
import { MasterCRUDTemplate, type FormField } from "@/components/master/MasterCRUDTemplate"
import { apiClient } from "@/lib/api"

export default function Subcategory() {
  // Fetch categories for the dropdown
  const { data: categories = [] } = useQuery({
    queryKey: ["categories_dropdown"],
    queryFn: async () => {
      const res = await apiClient.get("/product/categories/getCategories")
      return res.data?.data || []
    },
  })

  // Format categories for the select field
  const categoryOptions = categories.map((cat: any) => ({
    label: cat.categoryName,
    value: cat.categoryId,
  }))

  const fields: FormField[] = [
    { name: "subcategoryName", label: "Subcategory Name", type: "text", required: true },
    { name: "categoryId", label: "Category", type: "select", options: categoryOptions, required: true },
    { name: "subcategoryDescription", label: "Description", type: "richtext", required: false },
    { name: "subcategoryImage", label: "Image", type: "file", required: true },
  ]

  const columns = [
    { field: "subcategoryName", headerName: "SubCategory Name", width: 200 },
    {
      field: "categoryId",
      headerName: "Category Name",
      width: 200,
      cellRenderer: (params: any) => params.rowData?.category?.categoryName || "N/A"
    },
    { field: "subcategoryDescription", headerName: "Description", width: 400 },
    {
      field: "subcategoryImage",
      headerName: "Image",
      width: 200,
      cellRenderer: (params: any) => {
        if (!params.value) return <span className="text-muted-foreground italic">No Image</span>;
        const imageUrl = params.value.startsWith('http') ? params.value : `${import.meta.env.VITE_API_BASE_URL}/${params.value}`;
        return (
          <div className="flex items-center h-full">
            <img src={imageUrl} alt="Subcategory Image" className="h-10 w-10 object-contain rounded-md border" />
          </div>
        );
      }
    },
  ]

  const endpoints = {
    get: "/product/subcategories/getSubCategories",
    add: "/product/subcategories/addSubCategory",
    update: "/product/subcategories/updateSubCategory/{id}",
    delete: "/product/subcategories/deleteSubCategory/{id}",
  }

  return (
    <MasterCRUDTemplate
      title="Subcategory"
      queryKey="subcategories"
      endpoints={endpoints}
      fields={fields}
      gridColumns={columns}
      idField="subCategoryId"
    />
  )
}

