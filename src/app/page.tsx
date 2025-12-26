"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  Gift, 
  Play, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Settings2,
  CheckCircle2,
  AlertCircle,
  Edit2,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

interface Participant {
  id: string;
  name: string;
}

interface Prize {
  id: string;
  name: string;
  count: number;
}

interface Winner {
  participant: Participant;
  prize: Prize;
}

export default function LotteryPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([{ id: '1', name: '特等奖', count: 1 }]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDrawingPrize, setCurrentDrawingPrize] = useState<Prize | null>(null);
  const [drawProgress, setDrawProgress] = useState(0);
  const [view, setView] = useState<'setup' | 'drawing' | 'results'>('setup');
  
  const [nameInput, setNameInput] = useState('');
  const [countInput, setCountInput] = useState<number>(0);
  const [editingParticipantId, setEditingParticipantId] = useState<string | null>(null);

  // Auto-generate participants from count if needed
  const handleGenerateParticipants = () => {
    const newParticipants: Participant[] = Array.from({ length: countInput }, (_, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: `员工 ${i + 1}`
    }));
    setParticipants(newParticipants);
  };

  const updateParticipant = (id: string, name: string) => {
    setParticipants(participants.map(p => p.id === id ? { ...p, name } : p));
  };

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const addPrize = () => {
    setPrizes([...prizes, { id: Math.random().toString(36).substr(2, 9), name: '', count: 1 }]);
  };

  const updatePrize = (id: string, field: keyof Prize, value: string | number) => {
    setPrizes(prizes.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removePrize = (id: string) => {
    setPrizes(prizes.filter(p => p.id !== id));
  };

  const startLottery = () => {
    if (participants.length === 0 || prizes.length === 0) return;
    setWinners([]);
    setView('drawing');
    drawNextPrize(0);
  };

  const drawNextPrize = async (prizeIndex: number) => {
    if (prizeIndex >= prizes.length) {
      setView('results');
      return;
    }

    const prize = prizes[prizeIndex];
    setCurrentDrawingPrize(prize);
    setIsDrawing(true);
    
    // Simulate drawing animation
    for (let i = 0; i <= 100; i += 5) {
      setDrawProgress(i);
      await new Promise(r => setTimeout(r, 50));
    }

    // Pick winners for this prize
    const availableParticipants = participants.filter(p => !winners.some(w => w.participant.id === p.id));
    const shuffled = [...availableParticipants].sort(() => 0.5 - Math.random());
    const luckyOnes = shuffled.slice(0, prize.count);

    const newWinners = luckyOnes.map(p => ({ participant: p, prize }));
    setWinners(prev => [...prev, ...newWinners]);
    
    setIsDrawing(false);
    
    // Wait before next prize
    await new Promise(r => setTimeout(r, 1500));
    drawNextPrize(prizeIndex + 1);
  };

  const reset = () => {
    setView('setup');
    setWinners([]);
    setIsDrawing(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans selection:bg-red-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#E11D48] rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-200">
              <Trophy size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#0F172A]">乐歌 4supply</h1>
              <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">Intelligent Lottery System</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="px-3 py-1 border-slate-200 text-slate-600 bg-slate-50">
              v4.2.0 Stable
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {view === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-extrabold text-[#0F172A]">配置您的抽奖活动</h2>
                <p className="text-slate-500 max-w-lg mx-auto">
                  设置参与人数与奖品详情，乐歌智能系统将为您公平、公正地完成抽取任务。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Participants Card */}
                <Card className="border-slate-200 shadow-sm overflow-hidden group">
                  <div className="h-1 bg-slate-100 group-hover:bg-[#E11D48] transition-colors duration-300" />
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Users className="text-[#E11D48]" size={20} />
                        参与人员
                      </CardTitle>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                        {participants.length} 人
                      </Badge>
                    </div>
                    <CardDescription>输入总人数或逐一添加名单</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>批量设置人数</Label>
                        <div className="flex gap-2">
                          <Input 
                            type="number" 
                            placeholder="例如：50" 
                            value={countInput || ''}
                            onChange={(e) => setCountInput(parseInt(e.target.value))}
                            className="bg-slate-50 border-slate-200"
                          />
                          <Button 
                            onClick={handleGenerateParticipants}
                            variant="secondary"
                            className="bg-slate-900 text-white hover:bg-slate-800"
                          >
                            生成
                          </Button>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <Label>手动添加姓名</Label>
                        <div className="flex gap-2">
                          <Input 
                            placeholder="输入姓名" 
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            className="bg-slate-50 border-slate-200"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && nameInput) {
                                setParticipants([...participants, { id: Date.now().toString(), name: nameInput }]);
                                setNameInput('');
                              }
                            }}
                          />
                          <Button 
                            onClick={() => {
                              if (nameInput) {
                                setParticipants([...participants, { id: Date.now().toString(), name: nameInput }]);
                                setNameInput('');
                              }
                            }}
                            variant="outline"
                          >
                            <Plus size={18} />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-400 uppercase tracking-widest">人员名单 ({participants.length})</Label>
                        <div className="max-h-[200px] overflow-y-auto border border-slate-100 rounded-lg bg-slate-50/50 p-2 space-y-1 custom-scrollbar">
                          {participants.length === 0 ? (
                            <div className="text-center py-8 text-slate-400 text-sm">暂无人员</div>
                          ) : (
                            participants.map((p) => (
                              <div key={p.id} className="flex items-center gap-2 bg-white p-2 rounded-md border border-slate-100 group/p">
                                {editingParticipantId === p.id ? (
                                  <div className="flex items-center gap-1 w-full">
                                    <Input 
                                      value={p.name}
                                      onChange={(e) => updateParticipant(p.id, e.target.value)}
                                      className="h-8 text-sm"
                                      autoFocus
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') setEditingParticipantId(null);
                                      }}
                                    />
                                    <Button 
                                      size="icon" 
                                      variant="ghost" 
                                      className="h-8 w-8 text-green-600"
                                      onClick={() => setEditingParticipantId(null)}
                                    >
                                      <CheckCircle2 size={14} />
                                    </Button>
                                  </div>
                                ) : (
                                  <>
                                    <span className="text-sm font-medium text-slate-700 flex-1 truncate">{p.name}</span>
                                    <div className="flex items-center gap-1 opacity-0 group-hover/p:opacity-100 transition-opacity">
                                      <Button 
                                        size="icon" 
                                        variant="ghost" 
                                        className="h-7 w-7 text-slate-400 hover:text-[#E11D48]"
                                        onClick={() => setEditingParticipantId(p.id)}
                                      >
                                        <Edit2 size={12} />
                                      </Button>
                                      <Button 
                                        size="icon" 
                                        variant="ghost" 
                                        className="h-7 w-7 text-slate-400 hover:text-red-500"
                                        onClick={() => removeParticipant(p.id)}
                                      >
                                        <Trash2 size={12} />
                                      </Button>
                                    </div>
                                  </>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Prizes Card */}
                <Card className="border-slate-200 shadow-sm overflow-hidden group">
                  <div className="h-1 bg-slate-100 group-hover:bg-[#E11D48] transition-colors duration-300" />
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Gift className="text-[#E11D48]" size={20} />
                        奖品设置
                      </CardTitle>
                      <Button onClick={addPrize} variant="ghost" size="sm" className="h-8 text-[#E11D48]">
                        <Plus size={16} className="mr-1" /> 添加
                      </Button>
                    </div>
                    <CardDescription>设置奖项名称及各奖项的中奖人数</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {prizes.map((prize) => (
                      <div key={prize.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3 relative group/item">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase tracking-wider text-slate-400">奖项名称</Label>
                            <Input 
                              value={prize.name} 
                              onChange={(e) => updatePrize(prize.id, 'name', e.target.value)}
                              placeholder="如：一等奖"
                              className="h-9 bg-white"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase tracking-wider text-slate-400">名额数量</Label>
                            <Input 
                              type="number"
                              value={prize.count} 
                              onChange={(e) => updatePrize(prize.id, 'count', parseInt(e.target.value))}
                              className="h-9 bg-white"
                            />
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removePrize(prize.id)}
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white border border-slate-100 text-slate-400 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity shadow-sm"
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center pt-8">
                <Button 
                  size="lg" 
                  onClick={startLottery}
                  disabled={participants.length === 0 || prizes.length === 0}
                  className="bg-[#E11D48] hover:bg-[#BE123C] text-white px-12 py-7 rounded-2xl text-lg font-bold shadow-xl shadow-red-100 transition-all hover:scale-105 active:scale-95 group"
                >
                  <Play className="mr-2 group-hover:fill-current" size={20} />
                  开启乐歌抽奖
                </Button>
              </div>
            </motion.div>
          )}

          {view === 'drawing' && (
            <motion.div
              key="drawing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center justify-center space-y-12 py-12"
            >
              <div className="text-center space-y-4">
                <Badge className="bg-[#E11D48]/10 text-[#E11D48] border-none px-4 py-1.5 text-sm uppercase tracking-widest font-bold">
                  正在抽取
                </Badge>
                <h2 className="text-6xl font-black text-[#0F172A] tracking-tight">
                  {currentDrawingPrize?.name}
                </h2>
              </div>

              <div className="relative w-80 h-80 flex items-center justify-center">
                {/* Animated Rings */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-dashed border-slate-200 rounded-full"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-8 border-2 border-dashed border-red-100 rounded-full"
                />
                
                <div className="z-10 bg-white w-56 h-56 rounded-full shadow-2xl flex flex-col items-center justify-center border border-slate-100">
                  <div className="text-5xl font-mono font-black text-[#E11D48]">
                    {Math.floor(drawProgress)}%
                  </div>
                  <div className="text-xs font-bold text-slate-400 mt-2 tracking-widest uppercase">
                    Processing
                  </div>
                </div>
              </div>

              <div className="w-full max-w-md bg-slate-100 h-2 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${drawProgress}%` }}
                  className="bg-[#E11D48] h-full"
                />
              </div>

              <p className="text-slate-500 font-medium animate-pulse">
                乐歌 4supply 智能算法正在为您筛选中奖者...
              </p>
            </motion.div>
          )}

          {view === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full text-green-600 mb-2">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-4xl font-black text-[#0F172A]">恭喜中奖者！</h2>
                <p className="text-slate-500">所有奖项已圆满抽取完毕，结果如下：</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {prizes.map((prize) => {
                  const prizeWinners = winners.filter(w => w.prize.id === prize.id);
                  return (
                    <Card key={prize.id} className="border-slate-200 shadow-sm overflow-hidden">
                      <div className="bg-slate-900 px-4 py-3 flex justify-between items-center text-white">
                        <span className="font-bold">{prize.name}</span>
                        <Badge className="bg-white/20 hover:bg-white/30 border-none">
                          {prizeWinners.length} 名
                        </Badge>
                      </div>
                      <CardContent className="p-4 grid grid-cols-2 gap-2 bg-slate-50/50">
                        {prizeWinners.map((w, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-3 rounded-lg border border-slate-100 flex items-center gap-2 shadow-sm"
                          >
                            <div className="w-2 h-2 rounded-full bg-[#E11D48]" />
                            <span className="font-bold text-slate-700">{w.participant.name}</span>
                          </motion.div>
                        ))}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="flex justify-center gap-4 pt-8">
                <Button 
                  onClick={reset}
                  variant="outline"
                  className="px-8 border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  <RotateCcw className="mr-2" size={18} />
                  重新开始
                </Button>
                <Button 
                  onClick={() => window.print()}
                  className="px-8 bg-slate-900 text-white hover:bg-slate-800"
                >
                  导出结果
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-200 mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2 grayscale opacity-50">
            <Settings2 size={18} />
            <span className="text-sm font-semibold tracking-wider uppercase">Loctek Ergonomics</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-xs font-bold text-slate-400 hover:text-[#E11D48] transition-colors uppercase tracking-widest">隐私协议</a>
            <a href="#" className="text-xs font-bold text-slate-400 hover:text-[#E11D48] transition-colors uppercase tracking-widest">技术支持</a>
            <a href="#" className="text-xs font-bold text-slate-400 hover:text-[#E11D48] transition-colors uppercase tracking-widest">© 2025 Loctek</a>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }
      `}</style>
    </div>
  );
}
