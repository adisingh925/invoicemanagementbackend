DELIMITER $$

CREATE TRIGGER calculate_payment_due_date
BEFORE INSERT ON MEMBER
FOR EACH ROW
BEGIN
    DECLARE membership_duration INT;
    
    -- Get the membership duration based on membership type
    SELECT membership_duration_months INTO membership_duration
    FROM membership
    WHERE membership_id = NEW.member_membership_type;
    
    -- Calculate the payment due date
    SET NEW.payment_due_date = DATE_ADD(NEW.insert_time, INTERVAL membership_duration MONTH);
END;
$$

DELIMITER ;
