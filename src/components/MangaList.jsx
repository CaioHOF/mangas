
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, ExternalLink, Search, Filter } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const MangaList = ({ mangas, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterRating, setFilterRating] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filteredMangas, setFilteredMangas] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let result = [...mangas];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(manga => 
        manga.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (filterType) {
      result = result.filter(manga => manga.type === filterType);
    }
    
    // Apply rating filter
    if (filterRating) {
      result = result.filter(manga => manga.rating === filterRating);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let valueA, valueB;
      
      if (sortBy === 'name') {
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
      } else if (sortBy === 'rating') {
        const ratingOrder = ['EX', '+S', 'S', '-S', '+A', 'A', '-A', '+B', 'B', 'C', 'D', 'E', 'F', 'DeixarPraMaisTarde'];
        valueA = ratingOrder.indexOf(a.rating);
        valueB = ratingOrder.indexOf(b.rating);
      } else if (sortBy === 'viewDate') {
        valueA = new Date(a.viewDate || a.dateAdded);
        valueB = new Date(b.viewDate || b.dateAdded);
      } else {
        valueA = a[sortBy];
        valueB = b[sortBy];
      }
      
      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    
    setFilteredMangas(result);
  }, [mangas, searchTerm, filterType, filterRating, sortBy, sortOrder]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterType('');
    setFilterRating('');
    setSortBy('name');
    setSortOrder('asc');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não informada';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-300" size={18} />
          <Input
            type="text"
            placeholder="Buscar mangás..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 border-indigo-500/30 focus:border-indigo-400 placeholder:text-indigo-300/50"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
            className="border-indigo-500/30 text-indigo-300 flex items-center gap-2"
          >
            <Filter size={16} />
            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-indigo-300">Ordenar por:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[130px] h-9 bg-white/10 border-indigo-500/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-indigo-900 border-indigo-700">
                <SelectItem value="name">Nome</SelectItem>
                <SelectItem value="rating">Classificação</SelectItem>
                <SelectItem value="type">Tipo</SelectItem>
                <SelectItem value="viewDate">Data</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="text-indigo-300"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </div>
        </div>
        
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white/5 rounded-lg">
                <div>
                  <label className="text-sm text-indigo-300 mb-1 block">Tipo</label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="bg-white/10 border-indigo-500/30">
                      <SelectValue placeholder="Todos os tipos" />
                    </SelectTrigger>
                    <SelectContent className="bg-indigo-900 border-indigo-700">
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="manga">Manga</SelectItem>
                      <SelectItem value="manhwa">Manhwa</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-indigo-300 mb-1 block">Classificação</label>
                  <Select value={filterRating} onValueChange={setFilterRating}>
                    <SelectTrigger className="bg-white/10 border-indigo-500/30">
                      <SelectValue placeholder="Todas as classificações" />
                    </SelectTrigger>
                    <SelectContent className="bg-indigo-900 border-indigo-700 max-h-[200px]">
                      <SelectItem value="">Todas</SelectItem>
                      <SelectItem value="EX">EX</SelectItem>
                      <SelectItem value="+S">+S</SelectItem>
                      <SelectItem value="S">S</SelectItem>
                      <SelectItem value="-S">-S</SelectItem>
                      <SelectItem value="+A">+A</SelectItem>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="-A">-A</SelectItem>
                      <SelectItem value="+B">+B</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                      <SelectItem value="E">E</SelectItem>
                      <SelectItem value="F">F</SelectItem>
                      <SelectItem value="DeixarPraMaisTarde">Deixar Para Mais Tarde</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={handleClearFilters}
                    className="w-full border-indigo-500/30 text-indigo-300 hover:bg-indigo-800/50"
                  >
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {filteredMangas.length === 0 ? (
        <div className="text-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 rounded-lg p-8 max-w-md mx-auto"
          >
            <h3 className="text-xl font-semibold text-indigo-300 mb-2">Nenhum mangá encontrado</h3>
            <p className="text-indigo-200/70">
              {mangas.length === 0 
                ? "Adicione seu primeiro mangá clicando no botão + abaixo." 
                : "Tente ajustar seus filtros para ver mais resultados."}
            </p>
          </motion.div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredMangas.map((manga, index) => (
              <motion.div
                key={manga.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="manga-card rounded-lg p-5"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className={`type-badge type-${manga.type}`}>
                      {manga.type.charAt(0).toUpperCase() + manga.type.slice(1)}
                    </span>
                    <span className={`rating-badge rating-${manga.rating} ml-2`}>
                      {manga.rating}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEdit(manga)}
                      className="h-8 w-8 text-indigo-300 hover:text-white hover:bg-indigo-700/50"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setDeleteConfirm(manga)}
                      className="h-8 w-8 text-pink-300 hover:text-white hover:bg-pink-700/50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-2 text-white">{manga.name}</h3>
                
                <div className="space-y-2 text-sm text-indigo-200">
                  {manga.lastChapter && (
                    <p>Último capítulo: <span className="text-white">{manga.lastChapter}</span></p>
                  )}
                  <p>Visualizado em: <span className="text-white">{formatDate(manga.viewDate || manga.dateAdded)}</span></p>
                </div>
                
                {manga.link && (
                  <div className="mt-4">
                    <a 
                      href={manga.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-indigo-300 hover:text-indigo-100 text-sm"
                    >
                      <ExternalLink size={14} />
                      Abrir link
                    </a>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="bg-gray-900 border border-indigo-500/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-indigo-100">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-indigo-200">
              Tem certeza que deseja excluir <span className="font-semibold text-white">{deleteConfirm?.name}</span>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-indigo-500/30 text-indigo-300 hover:bg-indigo-800/50">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                onDelete(deleteConfirm.id);
                setDeleteConfirm(null);
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MangaList;
