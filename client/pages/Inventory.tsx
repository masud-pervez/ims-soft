import React, { useState } from "react";
import {
  Search,
  Plus,
  Layers,
  Settings,
  X,
  Edit2,
  Trash2,
  Save,
  Package,
  Image as ImageIcon,
  DollarSign,
  Box,
  Wand2,
  Loader2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ArrowRightLeft,
  ChevronRight,
  FolderPlus,
  Type,
  ShoppingCart,
} from "lucide-react";
import { Product, Category } from "../types";
import { editProductImage } from "../services/geminiService";
import {
  useProducts,
  useCategories,
  useHealthCheck,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useCreateCategory,
  useDeleteCategory,
} from "../hooks/useQueries";

const Inventory: React.FC = () => {
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();
  const { data: isBackendLive } = useHealthCheck();

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // AI States
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiTargetProduct, setAiTargetProduct] = useState<Product | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Category States
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [editingCategoryName, setEditingCategoryName] = useState("");

  // Product States
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productFormData, setProductFormData] = useState({
    name: "",
    categoryId: "",
    costPrice: 0,
    sellingPrice: 0,
    openingStock: 0,
    currentStock: 0,
    image: "",
  });

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || p.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAiEdit = async () => {
    if (!aiTargetProduct || !aiPrompt) return;
    setIsGenerating(true);
    try {
      const response = await fetch(aiTargetProduct.image || "");
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const result = await editProductImage(base64data, aiPrompt);
        setGeneratedImage(result);
        setIsGenerating(false);
      };
    } catch (err) {
      alert(
        "AI Processing Failed. External images may have CORS restrictions."
      );
      setIsGenerating(false);
    }
  };

  const saveAiImage = async () => {
    if (!aiTargetProduct || !generatedImage) return;
    try {
      await updateProduct.mutateAsync({
        ...aiTargetProduct,
        image: generatedImage,
      });
      // await onRefresh(); // handled by mutation onSuccess
      setShowAiModal(false);
      setGeneratedImage(null);
      setAiTargetProduct(null);
    } catch (err) {
      alert("Save Failed: " + err);
    }
  };

  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductFormData({
        name: product.name,
        categoryId: product.categoryId,
        costPrice: product.costPrice,
        sellingPrice: product.sellingPrice,
        openingStock: product.openingStock,
        currentStock: product.currentStock,
        image: product.image || "",
      });
    } else {
      setEditingProduct(null);
      setProductFormData({
        name: "",
        categoryId: categories[0]?.id || "",
        costPrice: 0,
        sellingPrice: 0,
        openingStock: 0,
        currentStock: 0,
        image: "https://picsum.photos/seed/" + Math.random() + "/400/400",
      });
    }
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBackendLive) return alert("System Offline.");
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({
          ...editingProduct,
          ...productFormData,
        });
      } else {
        const newId = `P-${Math.floor(100 + Math.random() * 900)}`;
        await createProduct.mutateAsync({
          id: newId,
          ...productFormData,
          currentStock: productFormData.openingStock,
        });
      }
      // await onRefresh();
      setShowProductModal(false);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      await createCategory.mutateAsync({
        id: `CAT-${Date.now()}`,
        name: newCategoryName,
      });
      setNewCategoryName("");
      // await onRefresh();
    } catch (e) {
      alert("Failed to add category");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (
      !window.confirm(
        "Delete category? Products in this category will become orphans."
      )
    )
      return;
    try {
      await deleteCategory.mutateAsync(id);
      // await onRefresh();
    } catch (e) {
      alert("Delete failed");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* AI Transformation Modal */}
      {showAiModal && aiTargetProduct && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[90] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-10 bg-slate-50 border-r border-slate-100 flex flex-col items-center justify-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">
                  Output Canvas
                </p>
                <div className="w-full aspect-square rounded-[2rem] bg-white shadow-inner overflow-hidden relative">
                  {isGenerating ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm">
                      <Loader2
                        className="animate-spin text-indigo-600 mb-4"
                        size={48}
                      />
                      <p className="text-xs font-black text-slate-900 animate-pulse uppercase tracking-widest">
                        Gemini Engine Working...
                      </p>
                    </div>
                  ) : generatedImage ? (
                    <img
                      src={generatedImage}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={aiTargetProduct.image}
                      className="w-full h-full object-cover opacity-50 grayscale"
                    />
                  )}
                </div>
              </div>
              <div className="p-12 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
                    Magic Wand
                  </h3>
                  <button
                    onClick={() => {
                      setShowAiModal(false);
                      setGeneratedImage(null);
                    }}
                    className="p-2 text-slate-400 hover:text-slate-900"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    AI Contextual Prompt
                  </label>
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-bold min-h-[150px] focus:ring-4 focus:ring-indigo-500/10"
                    placeholder="e.g. 'Remove background and put it on a minimalist white table', 'Make the colors more vibrant and professional'..."
                  />
                </div>
                <div className="flex gap-4">
                  {!generatedImage ? (
                    <button
                      onClick={handleAiEdit}
                      disabled={isGenerating || !aiPrompt}
                      className="flex-1 bg-indigo-600 text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
                    >
                      <Sparkles size={18} />
                      <span>Run AI Logic</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setGeneratedImage(null)}
                        className="flex-1 bg-slate-100 text-slate-400 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-slate-200"
                      >
                        Retry
                      </button>
                      <button
                        onClick={saveAiImage}
                        className="flex-[2] bg-emerald-600 text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center justify-center space-x-3 shadow-xl shadow-emerald-200 hover:bg-emerald-700"
                      >
                        <CheckCircle2 size={18} />
                        <span>Update Master Record</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Management Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[80] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-10 bg-indigo-600 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter">
                  {editingProduct ? "Edit Asset" : "New Inventory Asset"}
                </h3>
                <p className="text-[10px] text-indigo-200 font-black tracking-widest uppercase">
                  Asset Definition & Pricing Matrix
                </p>
              </div>
              <button
                onClick={() => setShowProductModal(false)}
                className="bg-white/10 p-2 rounded-xl hover:bg-white/20"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleProductSubmit} className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Product Name *
                  </label>
                  <input
                    required
                    value={productFormData.name}
                    onChange={(e) =>
                      setProductFormData({
                        ...productFormData,
                        name: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Category *
                  </label>
                  <select
                    required
                    value={productFormData.categoryId}
                    onChange={(e) =>
                      setProductFormData({
                        ...productFormData,
                        categoryId: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-xs font-black"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Base Cost (৳)
                  </label>
                  <input
                    required
                    type="number"
                    value={productFormData.costPrice}
                    onChange={(e) =>
                      setProductFormData({
                        ...productFormData,
                        costPrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    MSRP Selling (৳)
                  </label>
                  <input
                    required
                    type="number"
                    value={productFormData.sellingPrice}
                    onChange={(e) =>
                      setProductFormData({
                        ...productFormData,
                        sellingPrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black text-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Opening Stock
                  </label>
                  <input
                    required
                    type="number"
                    value={productFormData.openingStock}
                    onChange={(e) =>
                      setProductFormData({
                        ...productFormData,
                        openingStock: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 py-4 text-xs font-black uppercase text-slate-400"
                >
                  Discard
                </button>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center space-x-3 shadow-xl shadow-indigo-200"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Save size={18} />
                  )}
                  <span>
                    {editingProduct ? "Update Asset" : "Initialize Asset"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header & Control Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Master Inventory
          </h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">
            Real-time Asset Valuation & Control
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
            <button
              onClick={() => setShowCategoryManager(!showCategoryManager)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 transition-all ${
                showCategoryManager
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Layers size={14} />
              <span>Categories</span>
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Filter by name..."
              className="bg-white border-slate-100 rounded-2xl py-3 pl-12 pr-6 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 w-full md:w-72 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
              size={18}
            />
          </div>
          <button
            onClick={() => openProductModal()}
            className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center space-x-3 shadow-xl hover:bg-black transition-all"
          >
            <Plus size={16} />
            <span>Register Asset</span>
          </button>
        </div>
      </div>

      {/* Category Manager (In-place) */}
      {showCategoryManager && (
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight flex items-center">
              <Layers size={18} className="mr-3 text-indigo-500" />
              Category Laboratory
            </h3>
            <button
              onClick={() => setShowCategoryManager(false)}
              className="text-slate-400 hover:text-slate-900"
            >
              <X size={20} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 flex flex-col justify-center">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">
                Define New Stream
              </label>
              <div className="flex gap-3">
                <input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 bg-white border-none rounded-xl py-2 px-4 text-xs font-bold"
                  placeholder="e.g. Footwear"
                />
                <button
                  onClick={handleAddCategory}
                  className="bg-indigo-600 text-white p-2.5 rounded-xl"
                >
                  <FolderPlus size={18} />
                </button>
              </div>
            </div>
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-xs">
                    {cat.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800">
                      {cat.name}
                    </p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">
                      {products.filter((p) => p.categoryId === cat.id).length}{" "}
                      Units
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-2 text-rose-400 hover:text-rose-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid of Assets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden group hover:shadow-2xl transition-all relative"
          >
            <div className="relative h-60 bg-slate-100 overflow-hidden">
              <img
                src={p.image}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                <button
                  onClick={() => {
                    setAiTargetProduct(p);
                    setShowAiModal(true);
                  }}
                  className="w-12 h-12 bg-indigo-600 text-white rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Wand2 size={20} />
                </button>
                <button
                  onClick={() => openProductModal(p)}
                  className="w-12 h-12 bg-white text-slate-900 rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={async () => {
                    if (window.confirm("Wipe this asset?")) {
                      await deleteProduct.mutateAsync(p.id);
                    }
                  }}
                  className="w-12 h-12 bg-white text-rose-500 rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-900 shadow-sm border border-slate-100">
                  {categories.find((c) => c.id === p.categoryId)?.name ||
                    "Misc"}
                </span>
              </div>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-slate-900 truncate text-lg tracking-tight group-hover:text-indigo-600 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    UID: {p.id}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[9px] text-slate-400 uppercase font-black mb-1">
                    Depth
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-black ${
                        p.currentStock < 10 ? "text-rose-600" : "text-slate-900"
                      }`}
                    >
                      {p.currentStock}
                    </span>
                    <Box
                      size={14}
                      className={
                        p.currentStock < 10 ? "text-rose-400" : "text-slate-300"
                      }
                    />
                  </div>
                </div>
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                  <p className="text-[9px] text-emerald-500 uppercase font-black mb-1">
                    Selling
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-emerald-600">
                      ৳{p.sellingPrice.toLocaleString()}
                    </span>
                    <ShoppingCart size={14} className="text-emerald-400" />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"
                    ></div>
                  ))}
                  <div className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-indigo-600">
                    +12
                  </div>
                </div>
                <div className="text-[9px] text-slate-400 font-bold uppercase flex items-center">
                  Active Sales Cycle
                  <ChevronRight size={10} className="ml-1" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-32 text-center bg-white rounded-[3rem] border border-slate-100 border-dashed">
          <Package size={64} className="mx-auto text-slate-100 mb-6" />
          <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest">
            No matching assets in vault
          </h3>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("All");
            }}
            className="text-indigo-600 font-black text-xs uppercase mt-4 tracking-widest hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Inventory;
