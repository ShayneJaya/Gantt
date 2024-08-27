DECLARE
    v_task_id eba_demo_chart_tasks.id%TYPE := apex_application.g_x01; 
    v_start_date DATE := TO_DATE(apex_application.g_x02, 'MM/DD/YYYY');
    v_end_date DATE := TO_DATE(apex_application.g_x03, 'MM/DD/YYYY');    
BEGIN
    UPDATE eba_demo_chart_tasks
    SET start_date = v_start_date,
        end_date = v_end_date
    WHERE id = v_task_id;
     htp.p('{"status":"success"}');
   EXCEPTION
        WHEN OTHERS THEN
            htp.p('{"status":"error", "message":"' || SQLERRM || '"}');
    END;
