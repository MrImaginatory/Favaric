import { MasterCRUDTemplate, type FormField } from "@/components/master/MasterCRUDTemplate"

export default function Category() {
  const fields: FormField[] = [
    { name: "categoryName", label: "Category Name", type: "text", required: true },
    { name: "categoryDescription", label: "Description", type: "richtext", required: false },
    { name: "categoryImage", label: "Category Image", type: "file", required: false },
  ]

  const columns = [
    { field: "categoryName", headerName: "Name", width: 200 },
    { 
      field: "categoryDescription", 
      headerName: "Description", 
      width: 400,
      cellRenderer: (params: any) => {
        if (!params.value) return "";
        const plainText = params.value.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').trim();
        return <span className="truncate block" title={plainText}>{plainText}</span>;
      }
    },
    { 
      field: "categoryImage", 
      headerName: "Image", 
      width: 200,
      cellRenderer: (params: any) => {
        if (!params.value) return <span className="text-muted-foreground italic">No Image</span>;
        const imageUrl = params.value.startsWith('http') ? params.value : `${import.meta.env.VITE_API_BASE_URL}/${params.value}`;
        return (
          <div className="flex items-center h-full">
            <img src={imageUrl} alt="Category Image" className="h-10 w-10 object-contain rounded-md border" />
          </div>
        );
      }
    },
  ]

  const endpoints = {
    get: "/product/categories/getCategories",
    add: "/product/categories/addCategory",
    update: "/product/categories/updateCategory/{id}",
    delete: "/product/categories/deleteCategory/{id}",
    search: "/product/categories/searchCategory",
  }

  return (
    <MasterCRUDTemplate
      title="Category"
      queryKey="categories"
      endpoints={endpoints}
      fields={fields}
      gridColumns={columns}
      idField="categoryId"
    />
  )
}

