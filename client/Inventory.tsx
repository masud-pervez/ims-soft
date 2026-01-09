
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
  Box
} from 'lucide-react';
import { Product, Category } from '../types';
import { apiService } from '../apiService';

interface InventoryProps {
  products: Product[];
  categories: Category[];
  onRefresh: () => Promise<void>;
  isBackendLive: boolean;
}

const Inventory: React.FC<InventoryProps> = ({ products, categories, onRefresh, isBackendLive }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Category Management State
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  // Product Management State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    categoryId: '',
    costPrice: 0,
    sellingPrice: 0,
    openingStock: 0,
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
      alert(error.message);
    }
  };

  const handleUpdateCategory = async (id: string) => {
    if (!editingCategoryName.trim()) return;
    try {
      await apiService.updateCategory(id, editingCategoryName);
      setEditingCategoryId(null);
      await onRefresh();
    } catch (error: any) {
      alert(error.message);
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
    setEditingProduct(null);
    setProductFormData({
      name: '',
      categoryId: categories[0]?.id || '',
      costPrice: 0,
      sellingPrice: 0,
      openingStock: 0,
      image: 'https://picsum.photos/seed/' + Math.random() + '/400/400'
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
      openingStock: product.currentStock,
      image: product.image || ''
    });
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productFormData.name || !productFormData.categoryId) return alert("Please fill name and category");

    try {
      if (editingProduct) {
        await apiService.updateProduct({
          ...editingProduct,
          ...productFormData,
          currentStock: productFormData.openingStock // Simple update for demo
        });
      } else {
        const newId = `P-${Math.floor(100 + Math.random() * 900)}`;
        await apiService.createProduct({
          id: newId,
          ...productFormData,
          currentStock: productFormData.openingStock
        });
      }
      setShowProductModal(false);
      await onRefresh();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Permanently remove this product from inventory?")) return;
    try {
      await apiService.deleteProduct(id);
      await onRefresh();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Category Management Modal */}
      {showCategoryManager && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
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
                  placeholder="Create new category..." 
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
                  <div key={cat.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-slate-100 transition-colors">
                    {editingCategoryId === cat.id ? (
                      <div className="flex-1 flex gap-2">
                        <input 
                          autoFocus
                          type="text" 
                          className="flex-1 bg-white border border-indigo-200 rounded-lg py-1 px-3 text-sm"
                          value={editingCategoryName}
                          onChange={e => setEditingCategoryName(e.target.value)}
                        />
                        <button onClick={() => handleUpdateCategory(cat.id)} className="text-emerald-600">
                          <Save size={18} />
                        </button>
                        <button onClick={() => setEditingCategoryId(null)} className="text-slate-400">
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="text-sm font-black text-slate-700">{cat.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{cat.id}</p>
                        </div>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => { setEditingCategoryId(cat.id); setEditingCategoryName(cat.name); }}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg shadow-sm"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg shadow-sm"
                          >
                            <Trash2 size={14} />
                          </button>
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

      {/* Product Management Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
                  {editingProduct ? 'Update Product' : 'Register New Item'}
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase mt-1 tracking-widest">Global Inventory Catalog</p>
              </div>
              <button onClick={() => setShowProductModal(false)} className="bg-white text-slate-400 hover:text-slate-600 p-3 rounded-full shadow-sm">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleProductSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Full Product Title</label>
                  <div className="relative">
                    <input 
                      required
                      type="text" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all"
                      placeholder="e.g. Premium Smart Watch 4.0"
                      value={productFormData.name}
                      onChange={e => setProductFormData({...productFormData, name: e.target.value})}
                    />
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category Assignment</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold"
                    value={productFormData.categoryId}
                    onChange={e => setProductFormData({...productFormData, categoryId: e.target.value})}
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Initial Quantity</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold"
                      value={productFormData.openingStock}
                      onChange={e => setProductFormData({...productFormData, openingStock: parseInt(e.target.value) || 0})}
                    />
                    <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Purchase Cost (৳)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold"
                      value={productFormData.costPrice}
                      onChange={e => setProductFormData({...productFormData, costPrice: parseFloat(e.target.value) || 0})}
                    />
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Retail Price (৳)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold"
                      value={productFormData.sellingPrice}
                      onChange={e => setProductFormData({...productFormData, sellingPrice: parseFloat(e.target.value) || 0})}
                    />
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" size={18} />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Product Image Asset URL</label>
                  <div className="relative">
                    <input 
                      type="url" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold"
                      placeholder="https://..."
                      value={productFormData.image}
                      onChange={e => setProductFormData({...productFormData, image: e.target.value})}
                    />
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all flex items-center justify-center space-x-2"
                >
                  <Save size={16} />
                  <span>{editingProduct ? 'Confirm Updates' : 'Add to Stock'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Inventory Header */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-tight">Master Inventory</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Monitor asset valuation & stock availability</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search by ID or Name..." 
                className="bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-6 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 w-full md:w-80 transition-all"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
            <select 
              value={selectedCategory} 
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border-none rounded-2xl py-3 px-6 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all"
            >
              <option value="All">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowCategoryManager(true)}
                className="p-3 bg-slate-50 text-slate-500 rounded-2xl hover:bg-slate-100 hover:text-indigo-600 transition-all border border-slate-100"
                title="Manage Categories"
              >
                <Settings size={20} />
              </button>
              <button 
                onClick={openAddProduct}
                className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center space-x-2 hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all"
              >
                <Plus size={18} />
                <span>New Product</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map(p => {
          const cat = categories.find(c => c.id === p.categoryId);
          const isLowStock = p.currentStock < 15;
          return (
            <div key={p.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden group hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300">
              <div className="relative h-56 bg-slate-50 overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                
                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all duration-300 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100">
                  <button 
                    onClick={() => openEditProduct(p)}
                    className="p-4 bg-white text-indigo-600 rounded-2xl shadow-xl hover:scale-110 transition-transform"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(p.id)}
                    className="p-4 bg-white text-rose-600 rounded-2xl shadow-xl hover:scale-110 transition-transform"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur text-[9px] font-black text-indigo-600 uppercase shadow-sm border border-slate-100">
                    {cat?.name || 'Uncategorized'}
                  </span>
                </div>
                {isLowStock && (
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-rose-600 text-white text-[9px] font-black rounded-xl uppercase shadow-lg shadow-rose-200 animate-bounce">
                    Critical Stock
                  </div>
                )}
              </div>

              <div className="p-7">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-black text-slate-900 line-clamp-1 flex-1 pr-2">{p.name}</h3>
                  <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">{p.id}</span>
                </div>
                
                <div className="flex items-center space-x-2 mb-6">
                  <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${isLowStock ? 'bg-rose-500' : 'bg-indigo-500'}`}
                      style={{ width: `${Math.min((p.currentStock / (p.openingStock || 1)) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className={`text-[10px] font-black ${isLowStock ? 'text-rose-500' : 'text-slate-400'}`}>
                    {p.currentStock}/{p.openingStock || p.currentStock}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Retail Price</p>
                    <p className="text-xl font-black text-slate-900">৳{p.sellingPrice.toLocaleString()}</p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                    <p className="text-[9px] text-emerald-600 uppercase font-black tracking-widest mb-1">Total Value</p>
                    <p className="text-lg font-black text-emerald-700">৳{(p.currentStock * p.sellingPrice).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
                   <div className="flex items-center space-x-2 text-slate-400">
                     <Layers size={14} />
                     <span className="text-[10px] font-black uppercase tracking-widest">
                       Margin: {(((p.sellingPrice - p.costPrice) / p.sellingPrice) * 100).toFixed(0)}%
                     </span>
                   </div>
                   <button 
                     onClick={() => openEditProduct(p)}
                     className="text-indigo-600 hover:text-indigo-800 font-black text-[10px] uppercase tracking-widest"
                   >
                     Update Ledger
                   </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white p-20 rounded-[3rem] border border-slate-100 text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
             <Package className="text-slate-200" size={48} />
          </div>
          <h4 className="text-xl font-black text-slate-800">Warehouse Empty</h4>
          <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto font-medium">No products match your current search or category filters.</p>
        </div>
      )}
    </div>
  );
};

export default Inventory;
