DELIMITER $$
CREATE PROCEDURE add_to_cart(IN in_userId INT, in_productId INT, in_quantity INT)
BEGIN
	DECLARE num INT;
	SET num = (SELECT COUNT(*) FROM carts WHERE userId = in_userId AND productId = in_productId);
    CASE
	WHEN num >= 1 THEN UPDATE carts SET quantity = quantity + in_quantity WHERE userId = in_userId AND productId = in_productId;
	ELSE INSERT INTO carts (quantity, userId, productId) values (in_quantity, in_userId, in_productId);
    end case;
END $$
DELIMITER ;