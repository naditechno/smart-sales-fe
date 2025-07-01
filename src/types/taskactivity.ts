export interface TaskSchedule {
  id: number;
  assignment_id: number;
  scheduled_at: string; // format: "YYYY-MM-DD HH:mm"
  status: number;
}
