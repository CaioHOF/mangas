
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import MangaForm from '@/components/MangaForm';
import MangaList from '@/components/MangaList';
import MangaStats from '@/components/MangaStats';
import { Button } from '@/components/ui/button';
import { PlusCircle, BookOpen, BarChart } from 'lucide-react';

function App() {
  const [mangas, setMangas] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingManga, setEditingManga] = useState(null);
  const [activeTab, setActiveTab] = useState('list');
  const { toast } = useToast();

  useEffect(() => {
    const savedMangas = localStorage.getItem('mangas');
    if (savedMangas) {
      try {
        setMangas(JSON.parse(savedMangas));
      } catch (error) {
        console.error('Error parsing saved mangas:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar mangás",
          description: "Não foi possível carregar seus mangás salvos."
        });
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mangas', JSON.stringify(mangas));
  }, [mangas]);

  const handleAddManga = (manga) => {
    const newManga = {
      ...manga,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString()
    };
    
    setMangas([...mangas, newManga]);
    setIsFormOpen(false);
    toast({
      title: "Mangá adicionado",
      description: `${manga.name} foi adicionado à sua coleção.`
    });
  };

  const handleUpdateManga = (updatedManga) => {
    setMangas(mangas.map(manga => 
      manga.id === updatedManga.id ? updatedManga : manga
    ));
    setEditingManga(null);
    setIsFormOpen(false);
    toast({
      title: "Mangá atualizado",
      description: `${updatedManga.name} foi atualizado com sucesso.`
    });
  };

  const handleDeleteManga = (id) => {
    const mangaToDelete = mangas.find(manga => manga.id === id);
    setMangas(mangas.filter(manga => manga.id !== id));
    toast({
      title: "Mangá removido",
      description: `${mangaToDelete.name} foi removido da sua coleção.`
    });
  };

  const handleEditManga = (manga) => {
    setEditingManga(manga);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white">
      <header className="container mx-auto py-8">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-indigo-300"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Minha Coleção de Mangás
        </motion.h1>
        <motion.p 
          className="text-center mt-2 text-indigo-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Organize e classifique seus mangás favoritos
        </motion.p>
      </header>

      <main className="container mx-auto px-4 pb-20">
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-md p-1 rounded-lg flex">
            <Button 
              variant={activeTab === 'list' ? 'default' : 'ghost'} 
              onClick={() => setActiveTab('list')}
              className="flex items-center gap-2"
            >
              <BookOpen size={18} />
              <span>Coleção</span>
            </Button>
            <Button 
              variant={activeTab === 'stats' ? 'default' : 'ghost'} 
              onClick={() => setActiveTab('stats')}
              className="flex items-center gap-2"
            >
              <BarChart size={18} />
              <span>Estatísticas</span>
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'list' ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <MangaList 
                mangas={mangas} 
                onEdit={handleEditManga} 
                onDelete={handleDeleteManga} 
              />
            </motion.div>
          ) : (
            <motion.div
              key="stats"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MangaStats mangas={mangas} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="fixed bottom-8 right-8"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={() => {
              setEditingManga(null);
              setIsFormOpen(true);
            }}
            className="rounded-full h-14 w-14 p-0 bg-gradient-to-r from-pink-500 to-indigo-500 shadow-lg"
          >
            <PlusCircle size={24} />
          </Button>
        </motion.div>

        <AnimatePresence>
          {isFormOpen && (
            <MangaForm 
              isOpen={isFormOpen}
              onClose={() => {
                setIsFormOpen(false);
                setEditingManga(null);
              }}
              onSubmit={editingManga ? handleUpdateManga : handleAddManga}
              initialData={editingManga}
            />
          )}
        </AnimatePresence>
      </main>
      <Toaster />
    </div>
  );
}

export default App;
