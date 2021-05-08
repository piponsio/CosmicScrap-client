new View("Signin", function(view){
	view.addElement(Element.getElement("background"), 0);
	view.addElement(Element.getElement("ping"), 1);
	view.addElement(Element.getElement("userSignin"), 5);
	view.addElement(Element.getElement("emailSignin"), 5);
	view.addElement(Element.getElement("passSignin"), 5);
	view.addElement(Element.getElement("pass2Signin"), 5);
	view.addElement(Element.getElement("codeSignin"), 5);
	view.addElement(Element.getElement("submitSignin"), 5);
	view.addElement(Element.getElement("backButton"), 2);
	view.addElement(Element.getElement("messageSignin"), 6);
});