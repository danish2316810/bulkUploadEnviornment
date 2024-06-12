sap.ui.define([
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], function (MessageBox, MessageToast, Controller, Fragment, JSONModel) {
    "use strict";

    return Controller.extend("massupload.project1.controller.View1", {

        onInit: function() {
            // Create a JSON model for the form data
            var oModel = new JSONModel({
                ID: "",
                FIRST_NAME: "",
                LAST_NAME: "",
                DOB: "",
                ADDRESS: ""
            });

            // Set the binding mode to TwoWay to allow changes to be reflected
            // oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
            this.getView().setModel(oModel);
        },
        onFileChange: function (oEvent) {
            console.log("onFileChange event triggered");

            const oFileUploader = oEvent.getSource();
            const aFiles = oEvent.getParameter("files");

            if (aFiles && aFiles.length > 0) {
                this._oFile = aFiles[0];
                console.log("Selected File:", this._oFile);
            } else {
                this._oFile = null;
                console.error("No file selected");
            }
        },

        onUploadStudentsPress: function () {
            if (!this._oFile) {
                MessageToast.show("Please select a file first.");
                return;
            }

            const oReader = new FileReader();
            const that = this;

            oReader.onload = function (e) {
                const sFileContent = e.target.result;
                console.log("File Content:", sFileContent);

                // Make an AJAX call to upload the file content
                $.ajax({
                    url: "/odata/v4/catalog/UploadStudents",
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({ file: sFileContent }),
                    success: function (data) {
                        MessageToast.show("File uploaded successfully.");
                    },
                    error: function (error) {
                        MessageToast.show("File upload failed.");
                        console.error("Upload error:", error);
                    }
                });
            };

            oReader.readAsDataURL(this._oFile);
        },
        

        onSubmit: function() {
            // Get the form data from the model
            var oFormData = this.getView().getModel().getData();

            // Call a function to send the data to the backend
            this._sendDataToBackend(oFormData);
        },
        _sendDataToBackend: function(oFormData) {
            // Create an AJAX request or use a suitable method to send the data to the backend
            // Example using jQuery AJAX
            jQuery.ajax({
                url: "/odata/v4/catalog/STUDENTS", // URL to your backend service
                method: "POST", // HTTP method
                contentType: "application/json", // Content type of the request
                data: JSON.stringify(oFormData), // Convert the form data to a JSON string
                success: (data, textStatus, jqXHR) => {
                    // Handle success
                    console.log("Data submitted successfully");
                    // Display the message from the backend
                    MessageToast.show(data.message || "Data submitted successfully");
                    
                    this. _refresh()
                },
                error: (jqXHR, textStatus, errorThrown) => {
                    // Handle error
                    var errorMessage = "";
                    try {
                        var response = JSON.parse(jqXHR.responseText);
                        errorMessage = response.error.message || errorThrown;
                    } catch (e) {
                        errorMessage = errorThrown;
                    }
                    this. _refresh()
                    console.error("Error submitting data:", errorMessage);
                    // Display the error message from the backend
                    MessageBox.error("Error submitting data: " + errorMessage);
                }
            });
        },
        _refresh:function(){
            var oView = this.getView();
            var oModel = oView.getModel();
            oModel.setData({
                ID: "",
                FIRST_NAME: "",
                LAST_NAME: "",
                DOB: "",
                ADDRESS: ""
            });
        }
        
           
    });
});
