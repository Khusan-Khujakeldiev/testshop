import React from "react";

const CartItemAttributes = ({
  attributes,
  allAttributes,
  onAttributeClick,
}) => {
  return (
    <div className="cart-item-attributes">
      {attributes &&
        allAttributes &&
        Object.keys(attributes).map((attrName) =>
          allAttributes[attrName] ? (
            <div key={attrName} className="cart-item-attribute">
              <div className="attribute-name">{attrName}:</div>
              <div className="attribute-options">
                {allAttributes[attrName].map((option) => (
                  <div
                    key={option}
                    className={`attribute-option ${
                      attributes[attrName] === option ? "selected" : ""
                    }`}
                    onClick={() => onAttributeClick(attrName, option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          ) : null
        )}
    </div>
  );
};

export default CartItemAttributes;
