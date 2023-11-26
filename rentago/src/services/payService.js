export const pay = async (supabase, paymentMethod, amount, status, username, rent_id) => {
    const { data, error } = await supabase
        .from('payments')
        .insert([{ 
            method: paymentMethod, 
            amount: amount, 
            status: status, 
            username: username, 
            rent_id: rent_id 
        }])
        .select()
    
    if (error) {
        console.error(error)
        return false
    }

    const paymentId = data[0].payment_id
    const ONE_SECOND = 1000
    const DUE_INTERVAL = ONE_SECOND * 15
    const { error: taskError } = await supabase
        .from('scheduled_tasks')
        .insert([{
            payment_id: paymentId,
            due_time: new Date(Date.now() + DUE_INTERVAL )
        }])

    if (taskError) {
        console.error(taskError)
        return false
    }

    return true
}

export const checkPaymentDue = async (supabase) => {
    const { data: scheduled_tasks, error: tasksError } = await supabase
        .from('scheduled_tasks')
        .select('*')
        .lte('due_time', new Date().toISOString())

    if (tasksError) {
        return false
    }

    for (const task of scheduled_tasks) {
        const { error: updateError } = await supabase
            .from('payments')
            .update({ status: 'Success' })
            .eq('payment_id', task.payment_id)
            .select()
        
        if (updateError) {
            return false
        }

        const { error: deleteError } = await supabase
            .from('scheduled_tasks')
            .delete()
            .eq('task_id', task.task_id)
        
        if (deleteError) {
            return false
        }
    }
}