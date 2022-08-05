interface ResponseData {
    error?:string    
}

interface Task{
    task:string,
    priority:number,
    done:Boolean
}

interface TaskChange{
    task:string
}

interface PriorityChange{
    priority:number
}

interface DateChange{
    duedate:string
}

export {
    ResponseData,
    Task,
    DateChange,
    PriorityChange,
    TaskChange
}