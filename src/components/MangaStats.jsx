
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const MangaStats = ({ mangas }) => {
  const stats = useMemo(() => {
    // Count by type
    const typeCount = mangas.reduce((acc, manga) => {
      acc[manga.type] = (acc[manga.type] || 0) + 1;
      return acc;
    }, {});
    
    // Count by rating
    const ratingCount = mangas.reduce((acc, manga) => {
      acc[manga.rating] = (acc[manga.rating] || 0) + 1;
      return acc;
    }, {});
    
    // Sort ratings by predefined order
    const ratingOrder = ['EX', '+S', 'S', '-S', '+A', 'A', '-A', '+B', 'B', 'C', 'D', 'E', 'F', 'DeixarPraMaisTarde'];
    const sortedRatings = Object.entries(ratingCount).sort((a, b) => {
      return ratingOrder.indexOf(a[0]) - ratingOrder.indexOf(b[0]);
    });
    
    // Recent additions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentAdditions = mangas.filter(manga => {
      const addDate = new Date(manga.dateAdded);
      return addDate >= thirtyDaysAgo;
    }).length;
    
    // Calculate total
    const total = mangas.length;
    
    return {
      total,
      typeCount,
      sortedRatings,
      recentAdditions
    };
  }, [mangas]);
  
  const getMaxRatingCount = () => {
    if (stats.sortedRatings.length === 0) return 0;
    return Math.max(...stats.sortedRatings.map(([_, count]) => count));
  };
  
  const maxRatingCount = getMaxRatingCount();
  
  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/5 backdrop-blur-md rounded-lg p-6"
      >
        <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-indigo-300">
          Estatísticas da Coleção
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 rounded-lg p-5 text-center">
            <h3 className="text-lg font-semibold text-indigo-300 mb-2">Total de Mangás</h3>
            <p className="text-4xl font-bold text-white">{stats.total}</p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-5 text-center">
            <h3 className="text-lg font-semibold text-indigo-300 mb-2">Adicionados Recentemente</h3>
            <p className="text-4xl font-bold text-white">{stats.recentAdditions}</p>
            <p className="text-xs text-indigo-400 mt-1">Últimos 30 dias</p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-5 text-center">
            <h3 className="text-lg font-semibold text-indigo-300 mb-2">Tipos</h3>
            <div className="flex justify-center gap-3 mt-3">
              {Object.entries(stats.typeCount).map(([type, count]) => (
                <div key={type} className={`type-badge type-${type} flex items-center gap-1`}>
                  <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  <span className="font-bold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/5 backdrop-blur-md rounded-lg p-6"
      >
        <h2 className="text-xl font-bold mb-6 text-center text-indigo-200">
          Distribuição por Classificação
        </h2>
        
        {stats.sortedRatings.length === 0 ? (
          <p className="text-center text-indigo-300">Nenhum dado disponível</p>
        ) : (
          <div className="space-y-3">
            {stats.sortedRatings.map(([rating, count], index) => (
              <motion.div 
                key={rating}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center gap-3"
              >
                <div className={`rating-badge rating-${rating} w-12 text-center`}>
                  {rating}
                </div>
                <div className="flex-1 bg-white/10 rounded-full h-6 overflow-hidden">
                  <motion.div 
                    className={`rating-${rating} h-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / maxRatingCount) * 100}%` }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                  />
                </div>
                <div className="w-8 text-right font-semibold text-white">
                  {count}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MangaStats;
