
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

const ratingOptions = [
  'EX', '+S', 'S', '-S', '+A', 'A', '-A', '+B', 'B', 'C', 'D', 'E', 'F', 'DeixarPraMaisTarde'
];

const typeOptions = ['manga', 'manhwa', 'outro'];

const MangaForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'manga',
    rating: 'B',
    link: '',
    lastChapter: '',
    viewDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        viewDate: initialData.viewDate ? initialData.viewDate.split('T')[0] : new Date().toISOString().split('T')[0]
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: initialData?.id || null
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-gray-900 to-indigo-900 border border-indigo-500/20 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-indigo-300">
            {initialData ? 'Editar Mangá' : 'Adicionar Novo Mangá'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-indigo-200">Nome</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nome do mangá"
              required
              className="bg-indigo-950/50 border-indigo-700/50 focus:border-indigo-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-indigo-200">Tipo</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger className="bg-indigo-950/50 border-indigo-700/50">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="bg-indigo-900 border-indigo-700">
                  {typeOptions.map(type => (
                    <SelectItem key={type} value={type} className="hover:bg-indigo-800">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rating" className="text-indigo-200">Classificação</Label>
              <Select 
                value={formData.rating} 
                onValueChange={(value) => handleSelectChange('rating', value)}
              >
                <SelectTrigger className="bg-indigo-950/50 border-indigo-700/50">
                  <SelectValue placeholder="Selecione a classificação" />
                </SelectTrigger>
                <SelectContent className="bg-indigo-900 border-indigo-700 max-h-[200px]">
                  {ratingOptions.map(rating => (
                    <SelectItem key={rating} value={rating} className="hover:bg-indigo-800">
                      {rating}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="link" className="text-indigo-200">Link</Label>
            <Input
              id="link"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="URL do mangá (opcional)"
              className="bg-indigo-950/50 border-indigo-700/50 focus:border-indigo-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lastChapter" className="text-indigo-200">Último Capítulo</Label>
              <Input
                id="lastChapter"
                name="lastChapter"
                value={formData.lastChapter}
                onChange={handleChange}
                placeholder="Ex: 123"
                className="bg-indigo-950/50 border-indigo-700/50 focus:border-indigo-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="viewDate" className="text-indigo-200">Data de Visualização</Label>
              <Input
                id="viewDate"
                name="viewDate"
                type="date"
                value={formData.viewDate}
                onChange={handleChange}
                className="bg-indigo-950/50 border-indigo-700/50 focus:border-indigo-500"
              />
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-indigo-500 text-indigo-300 hover:bg-indigo-800/50"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600"
            >
              {initialData ? 'Atualizar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MangaForm;
