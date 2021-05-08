new View("Login", function(view){
	view.addElement(Element.getElement("userInput"), 5);
	view.addElement(Element.getElement("passInput"), 5);
	view.addElement(Element.getElement("submitInput"), 5);
	view.addElement(Element.getElement("signinButton"), 5);
	view.addElement(Element.getElement("background"), 0);
	view.addElement(Element.getElement("ping"), 1);
	view.addElement(Element.getElement("messageLogin"), 2);
});