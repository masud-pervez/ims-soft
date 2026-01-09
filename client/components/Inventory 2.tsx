import React, { useState } from 'react';
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
  ArrowRightLeft
} from 'lucide-react';
import { Product, Category } from '../types';
import { apiService } from '../apiService';
import { editProductImage } from '../geminiService';

interface InventoryProps {
  products: Product[];
  categories: Category[];
  onRefresh: () => Promise<void>;
  isBackendLive: boolean;
}

const Inventory: React.FC<InventoryProps> = ({ products, categories, onRefresh, isBackendLive }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // States
  const [isAiEditing, setIsAiEditing] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTargetProduct, setAiTargetProduct] = useState<Product | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productFormData, setProductFormData] = useState({
    name: '',
    categoryId: '',
    costPrice: 0,
    sellingPrice: 0,
    openingStock: 0,
    currentStock: 0,
    image: ''
  });

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // --- Category Handlers ---
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      const newId = `CAT${Math.floor(100 + Math.random() * 900)}`;
      await apiService.createCategory({ id: newId, name: newCategoryName });
      setNewCategoryName('');
      await onRefresh();
    } catch (error: any) {
      alert("Category creation failed: " + error.message);
    }
  };

  const handleUpdateCategory = async (id: string) => {
    if (!editingCategoryName.trim()) return;
    try {
      await apiService.updateCategory(id, editingCategoryName);
      setEditingCategoryId(null);
      await onRefresh();
    } catch (error: any) {
      alert("Category update failed: " + error.message);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("Are you sure? Products linked to this category will prevent deletion.")) return;
    try {
      await apiService.deleteCategory(id);
      await onRefresh();
    } catch (error: any) {
      alert(error.message);
    }
  };

  // --- Product Handlers ---
  const openAddProduct = () => {
    if (categories.length === 0) {
      alert("⚠️ No categories found in database. Please create a category first in 'Category Lab'.");
      setShowCategoryManager(true);
      return;
    }
    setEditingProduct(null);
    setProductFormData({
      name: '',
      categoryId: categories[0]?.id || '',
      costPrice: 0,
      sellingPrice: 0,
      openingStock: 0,
      currentStock: 0,
      image: 'https://picsum.photos/seed/' + Math.floor(Math.random() * 1000) + '/400/400'
    });
    setShowProductModal(true);
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name,
      categoryId: product.categoryId,
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      openingStock: product.openingStock,
      currentStock: product.currentStock,
      image: product.image || ''
    });
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBackendLive) return alert("System is offline. Please start your Node server.");
    if (!productFormData.name.trim()) return alert("Product Name is required.");
    if (!productFormData.categoryId) return alert("Please select a category.");

    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await apiService.updateProduct({
          ...editingProduct,
          ...productFormData
        });
      } else {
        const newId = `P-${Math.floor(100 + Math.random() * 900)}`;
        await apiService.createProduct({
          id: newId,
          ...productFormData,
          currentStock: productFormData.openingStock // Set current to opening on new creation
        });
      }
      await onRefresh();
      setShowProductModal(false);
    } catch (error: any) {
      console.error("Submission Failure:", error);
      alert("❌ Critical Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Category Manager */}
      {showCategoryManager && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Settings className="text-indigo-600" size={20} />
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Category Lab</h3>
              </div>
              <button onClick={() => setShowCategoryManager(false)} className="text-slate-400 hover:text-slate-600 p-2">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="New category..." 
                  className="flex-1 bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                />
                <button type="submit" className="bg-indigo-600 text-white px-5 rounded-xl text-xs font-black uppercase hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                  Add
                </button>
              </form>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {categories.map(cat => (
                  <div key={cat.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group">
                    {editingCategoryId === cat.id ? (
                      <div className="flex-1 flex gap-2">
                        <input autoFocus type="text" className="flex-1 bg-white border border-indigo-200 rounded-lg py-1 px-3 text-sm" value={editingCategoryName} onChange={e => setEditingCategoryName(e.target.value)} />
                        <button onClick={() => handleUpdateCategory(cat.id)} className="text-emerald-600"><Save size={18}/></button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="text-sm font-black text-slate-700">{cat.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{cat.id}</p>
                        </div>
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100">
                          <button onClick={() => {setEditingCategoryId(cat.id); setEditingCategoryName(cat.name);}} className="p-2 text-slate-400 hover:text-indigo-600"><Edit2 size={14}/></button>
                          <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 text-slate-400 hover:text-rose-600"><Trash2 size={14}/></button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
                  {editingProduct ? 'Edit Catalog Entry' : 'Register New Asset'}
                </h3>
              </div>
              <button onClick={() => setShowProductModal(false)} className="bg-white text-slate-400 hover:text-slate-600 p-3 rounded-full shadow-sm">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleProductSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Product Name</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    value={productFormData.name}
                    onChange={e => setProductFormData({...productFormData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                  <select 
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold"
                    value={productFormData.categoryId}
                    onChange={e => setProductFormData({...productFormData, categoryId: e.target.value})}
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Purchase Cost (৳)</label>
                  <input 
                    type="number" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold"
                    value={productFormData.costPrice}
                    onChange={e => setProductFormData({...productFormData, costPrice: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="md:col-span-2 p-5 bg-indigo-50/50 rounded-3xl border border-indigo-100/50 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center">
                      <Box size={10} className="mr-1" /> Original Opening
                    </label>
                    <input 
                      type="number" 
                      className="w-full bg-white border border-indigo-100 rounded-2xl py-3 px-4 text-sm font-black"
                      value={productFormData.openingStock}
                      onChange={e => setProductFormData({...productFormData, openingStock: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center">
                      <ArrowRightLeft size={10} className="mr-1" /> Live Inventory Stock
                    </label>
                    <input 
                      type="number" 
                      className="w-full bg-white border border-emerald-100 rounded-2xl py-3 px-4 text-sm font-black text-emerald-600"
                      value={productFormData.currentStock}
                      onChange={e => setProductFormData({...productFormData, currentStock: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Retail Price (৳)</label>
                  <input 
                    type="number" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold"
                    value={productFormData.sellingPrice}
                    onChange={e => setProductFormData({...productFormData, sellingPrice: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="md:col-span-1">
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Visual Preview</label>
                   <div className="w-full h-12 bg-slate-100 rounded-xl overflow-hidden">
                      <img src={productFormData.image} className="w-full h-full object-cover" />
                   </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Image URL</label>
                  <input 
                    type="url" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold"
                    placeholder="https://..."
                    value={productFormData.image}
                    onChange={e => setProductFormData({...productFormData, image: e.target.value})}
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                <span>{isSubmitting ? 'Synchronizing...' : (editingProduct ? 'Commit Changes' : 'Register Product')}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 leading-tight">Master Inventory</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Real-time asset & category management</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Filter by name or ID..." 
              className="bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-6 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 w-full md:w-72"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </div>
          <button onClick={() => setShowCategoryManager(true)} className="p-3 bg-slate-50 text-slate-500 rounded-2xl hover:text-indigo-600 border border-slate-100">
            <Settings size={20} />
          </button>
          <button onClick={openAddProduct} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center space-x-2 hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all">
            <Plus size={18} />
            <span>New Product</span>
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-10">
        {filteredProducts.map(p => (
          <div key={p.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="relative h-48 bg-slate-50 overflow-hidden">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                <button onClick={() => openEditProduct(p)} className="p-2 bg-white text-indigo-600 rounded-xl shadow-lg hover:scale-110 transition-transform"><Edit2 size={16}/></button>
                <button onClick={async () => { if(window.confirm('Delete this product?')) { await apiService.deleteProduct(p.id); onRefresh(); } }} className="p-2 bg-white text-rose-600 rounded-xl shadow-lg hover:scale-110 transition-transform"><Trash2 size={16}/></button>
              </div>
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur text-[10px] font-black text-indigo-600 uppercase rounded-lg shadow-sm">
                  {categories.find(c => c.id === p.categoryId)?.name || 'Misc'}
                </span>
              </div>
            </div>
            <div className="p-7">
              <h3 className="font-black text-slate-900 truncate mb-1">{p.name}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">{p.id}</p>
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-black mb-1">Available</p>
                  <p className={`font-black ${p.currentStock < 10 ? 'text-rose-600' : 'text-slate-900'}`}>{p.currentStock} Units</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-400 uppercase font-black mb-1">Unit Price</p>
                  <p className="font-black text-emerald-600">৳{p.sellingPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
            <Package size={48} className="mx-auto text-slate-200 mb-4 opacity-30" />
            <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No matching products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;