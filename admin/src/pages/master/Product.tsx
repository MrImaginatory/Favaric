import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import { MasterCRUDTemplate, type FormField } from "@/components/master/MasterCRUDTemplate"

const useReferenceData = () => {
  return useQuery({
    queryKey: ["referenceData"],
    queryFn: async () => {
      const res = await apiClient.get("/product/referenceData")
      return res.data?.data || {}
    }
  })
}

// Helper to format options
const formatOptions = (records: any[], idKey: string, nameKey: string, fallbackKey?: string) => {
  if (!records) return [];
  return records.map((r: any) => ({
    label: r[nameKey] || (fallbackKey ? r[fallbackKey] : null) || r.name || r.title || r.value || "Unknown",
    value: r[idKey]
  }))
}

export default function Product() {
  const { data: refData = {} } = useReferenceData()

  const categories = formatOptions(refData.categories, "categoryId", "categoryName")
  const brands = formatOptions(refData.brands, "brandId", "brandName")
  const fabrics = formatOptions(refData.fabrics, "fabricId", "fabricName")
  const occasions = formatOptions(refData.occasions, "occasionId", "occasionName")
  const patterns = formatOptions(refData.patterns, "patternId", "patternName")
  const lengths = formatOptions(refData.lengths, "lengthId", "lengthName", "lengthValue")
  const countries = formatOptions(refData.countries, "countryOfOriginId", "countryOfOriginName")
  const colors = formatOptions(refData.colors, "colorId", "colorName")
  const sizes = formatOptions(refData.sizes, "sizeId", "sizeName", "sizeValue")
  const weights = formatOptions(refData.weights, "weightId", "weightName", "weightValue")
  const dimensions = formatOptions(refData.dimensions, "dimensionId", "dimensionName")
  const productTypes = formatOptions(refData.productTypes, "productTypeId", "productTypeName")
  const catalogs = formatOptions(refData.catalogs, "catalogId", "catalogName")
  const shippingCharges = formatOptions(refData.shippingCharges, "shippingChargeId", "shippingBaseCountry")

  const fields: FormField[] = [
    // Text / Strings
    { name: "productName", label: "Product Name", type: "text", required: true },
    { name: "productTitle", label: "Product Title", type: "text", required: true },
    { name: "productDescription", label: "Description", type: "richtext",
      maxLength: 2000, required: true },
    { name: "designCode", label: "Design Code", type: "text", required: true },
    { name: "sku", label: "SKU", type: "text", required: true },
    { name: "hsn", label: "HSN", type: "text", required: true },
    { name: "transparency", label: "Transparency", type: "text", required: true },
    { name: "currency", label: "Currency (e.g. INR)", type: "text", required: true },
    { name: "otherDetails", label: "Other Details", type: "textarea", required: false },

    // Numbers
    { name: "regularPrice", label: "Regular Price", type: "number", required: true },
    { name: "salePrice", label: "Sale Price", type: "number", required: true },
    { name: "gstPercentage", label: "GST Percentage", type: "number", required: true },
    { name: "stock", label: "Stock", type: "number", required: true },
    { name: "maxOrderQty", label: "Max Order Qty", type: "number", required: true },
    { name: "minOrderQty", label: "Min Order Qty", type: "number", required: true },
    { name: "quantityPerUnit", label: "Quantity Per Unit", type: "number", required: true },
    { name: "moq", label: "MOQ", type: "number", required: true },
    { name: "pinPosition", label: "Pin Position", type: "number", required: false },

    // Selects (Relational)
    { name: "category", label: "Category", type: "select", options: categories, required: true },
    { name: "brand", label: "Brand", type: "select", options: brands, required: true },
    { name: "fabric", label: "Fabric", type: "select", options: fabrics, required: true },
    { name: "occasion", label: "Occasion", type: "select", options: occasions, required: true },
    { name: "pattern", label: "Pattern", type: "select", options: patterns, required: true },
    { name: "length", label: "Length", type: "select", options: lengths, required: true },
    { name: "countryOfOrigin", label: "Country Of Origin", type: "select", options: countries, required: true },
    { name: "color", label: "Color", type: "select", options: colors, required: true },
    { name: "size", label: "Size", type: "select", options: sizes, required: true },
    { name: "weight", label: "Weight", type: "select", options: weights, required: true },
    { name: "dimensions", label: "Dimensions", type: "select", options: dimensions, required: true },
    { name: "productType", label: "Product Type", type: "select", options: productTypes, required: true },
    { name: "shippingCharge", label: "Shipping Charge", type: "select", options: shippingCharges, required: true },
    { name: "catalogId", label: "Catalog (Optional)", type: "select", options: catalogs, required: false },

    // Files
    { name: "thumbnailImage", label: "Thumbnail Image", type: "file", required: true },
    { name: "image", label: "Main Image", type: "file", required: true },
    { name: "subImages", label: "Sub Images", type: "file", multiple: true, required: false },

    // Booleans
    { name: "isFeatured", label: "Featured", type: "boolean", required: false },
    { name: "isTrending", label: "Trending", type: "boolean", required: false },
    { name: "isNewArrival", label: "New Arrival", type: "boolean", required: false },
    { name: "isDiscounted", label: "Discounted", type: "boolean", required: false },
    { name: "isAvailable", label: "Available", type: "boolean", required: false },
    { name: "isCatalog", label: "Is Catalog", type: "boolean", required: false },
    { name: "isPinned", label: "Pinned", type: "boolean", required: false },
    { name: "productStitched", label: "Stitched", type: "boolean", required: false },
  ]

  const columns = [
    { field: "productName", headerName: "Name", width: 180 },
    { field: "sku", headerName: "SKU", width: 120 },
    { field: "regularPrice", headerName: "Price", width: 100 },
    { field: "stock", headerName: "Stock", width: 100 },
    {
      field: "isAvailable",
      headerName: "Available",
      width: 100,
      cellRenderer: (params: any) => params.value ? "Yes" : "No"
    },
    {
      field: "thumbnailImage",
      headerName: "Thumbnail",
      width: 120,
      cellRenderer: (params: any) => {
        if (!params.value) return <span className="text-muted-foreground italic">No Image</span>;
        
        const filename = params.value.split('/').pop();
        const imageUrl = params.value.startsWith('http') ? params.value : `${import.meta.env.VITE_API_BASE_URL}/uploads/product/${filename}`;
        
        return (
          <div className="flex items-center h-full">
            <img src={imageUrl} alt="Product Thumbnail" className="h-10 w-10 object-contain rounded-md border" />
          </div>
        );
      }
    }
  ]

  const endpoints = {
    get: "/product/products/getProducts",
    add: "/product/products/addProduct",
    update: "/product/products/updateProduct/{id}",
    delete: "/product/products/deleteProduct/{id}",
    search: "/product/products/searchProduct",
  }

  return (
    <MasterCRUDTemplate
      title="Product"
      queryKey="products"
      endpoints={endpoints}
      fields={fields}
      gridColumns={columns}
      idField="productId"
    />
  )
}
