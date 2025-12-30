import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// ============================================
// API: TAREFAS/PEDIDOS DO SÓCIO
// ============================================
// Endpoint para consultar e criar tarefas via Telegram

export interface Task {
    id?: string;
    title: string;
    description?: string;
    status: 'pending' | 'in_progress' | 'done';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    source: 'telegram' | 'dashboard' | 'system';
    created_at?: string;
    completed_at?: string;
}

// GET: Listar tarefas
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');

        if (!supabase) {
            // Fallback: retornar tarefas mockadas
            return NextResponse.json({
                success: true,
                tasks: [
                    {
                        id: '1',
                        title: 'Subir campanhas Meta Ads',
                        status: 'pending',
                        priority: 'high',
                        source: 'telegram'
                    },
                    {
                        id: '2',
                        title: 'Follow-up Jadiel',
                        status: 'pending',
                        priority: 'high',
                        source: 'system'
                    }
                ]
            });
        }

        let query = supabase.from('tasks').select('*').order('created_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error } = await query.limit(20);

        if (error) {
            console.error('[TASKS] Error:', error);
            return NextResponse.json({ success: false, error: error.message });
        }

        return NextResponse.json({
            success: true,
            tasks: data || []
        });

    } catch (error) {
        console.error('[TASKS API] Error:', error);
        return NextResponse.json({ success: false, error: 'Erro ao buscar tarefas' }, { status: 500 });
    }
}

// POST: Criar nova tarefa
export async function POST(req: Request) {
    try {
        const body: Partial<Task> = await req.json();

        if (!body.title) {
            return NextResponse.json({
                success: false,
                error: 'Título é obrigatório'
            }, { status: 400 });
        }

        const task: Task = {
            title: body.title,
            description: body.description || '',
            status: body.status || 'pending',
            priority: body.priority || 'medium',
            source: body.source || 'system',
        };

        if (!supabase) {
            // Fallback: apenas confirmar
            return NextResponse.json({
                success: true,
                task: { ...task, id: `local_${Date.now()}` },
                message: 'Tarefa registrada (modo local)'
            });
        }

        const { data, error } = await supabase
            .from('tasks')
            .insert(task)
            .select()
            .single();

        if (error) {
            console.error('[TASKS] Insert error:', error);
            return NextResponse.json({ success: false, error: error.message });
        }

        return NextResponse.json({
            success: true,
            task: data
        });

    } catch (error) {
        console.error('[TASKS API] Error:', error);
        return NextResponse.json({ success: false, error: 'Erro ao criar tarefa' }, { status: 500 });
    }
}
