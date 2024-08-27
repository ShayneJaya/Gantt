select task_name    task_name,
       id           task_id,
       start_date   task_start_date,
       end_date     task_end_date,
       decode(status,'Closed',1,'Open',0.6,'On-Hold',0.1,'Pending',0) status,
       (select min(start_date) -5 from eba_demo_chart_tasks) gantt_start_date,
       (select max(end_date) from eba_demo_chart_tasks)  gantt_end_date
from eba_demo_chart_tasks
where task_name like 'I%s'
order by id asc