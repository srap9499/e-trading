DELIMITER $$
CREATE PROCEDURE update_cart(IN in_userId INT, in_productId INT, in_quantity INT)
BEGIN
	CASE
	WHEN in_quantity <= 0 THEN DELETE FROM carts WHERE userId = in_userId AND productId = in_productId;
	ELSE UPDATE carts SET quantity = in_quantity WHERE userId = in_userId AND productId = in_productId;
    end case;
END $$
DELIMITER ;