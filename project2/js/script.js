$(document).ready(function(){

  // $(".alert").hide()
  // Get all personnel records
  const getAllPersonnel = ()=>{
    $.ajax({
      url:"php/getAll.php",
      type: "GET",
      dataType: "json",
      success: function(res){
        if(res.status.code === "200"){
          $("#personnelTableBody").empty()
          var frag = document.createDocumentFragment();

          res.data.forEach(person =>{
            var row = document.createElement("tr");

            var name = document.createElement("td");
            name.classList = "align-middle text-nowrap";
            var nameText = document.createTextNode(`${person.firstName}, ${person.lastName}`);
            name.append(nameText);
            row.append(name);
            
            var department = document.createElement("td");
            var departmentText = document.createTextNode(person.department);
            department.classList = "align-middle text-nowrap";
            department.append(departmentText);
            row.append(department);

            var location = document.createElement("td");
            var locationText = document.createTextNode(person.location);
            location.classList = "align-middle text-nowrap";
            location.append(locationText);
            row.append(location);

            var email = document.createElement("td");
            var emailText = document.createTextNode(person.email);
            email.classList = "align-middle text-nowrap";
            email.append(emailText);
            row.append(email);
            

            var btnTD = document.createElement("td");
            btnTD.classList = "text-end text-nowrap";

            var btn1 = document.createElement("button");
            btn1.classList = "btn btn-primary btn-sm m-1"
            btn1.setAttribute("data-bs-toggle", "modal")
            btn1.setAttribute("type", "button")
            btn1.setAttribute("data-bs-target","#editPersonnelModal")
            btn1.setAttribute("data-bs-target","#editPersonnelModal")
            btn1.setAttribute("data-id",person.id)
            var icon1 = document.createElement("i")
            icon1.classList = "fa-solid fa-pencil fa-fw";
            btn1.append(icon1)

            var btn2 = document.createElement("button");
            btn2.classList = "btn btn-primary btn-sm"
            btn2.setAttribute("type", "button")
            btn2.setAttribute("data-bs-toggle", "modal")
            btn2.setAttribute("data-bs-target","#deletePersonnelModal")
            btn2.setAttribute("data-id",person.id)
            var icon2 = document.createElement("i");
            icon2.classList = "fa-solid fa-trash fa-fw";
            btn2.append(icon2)

            btnTD.append(btn1);
            btnTD.append(btn2);
            row.append(btnTD);    
                      
            frag.append(row);

            // $("#personnelTableBody").append(
            //   `
            //   <tr>
            //     <td class="align-middle text-nowrap">
            //     ${person.firstName}, ${person.lastName}
            //     </td>
            //     <td class="align-middle text-nowrap d-none d-md-table-cell">
            //     ${person.department}
            //     </td>
            //     <td class="align-middle text-nowrap d-none d-md-table-cell">
            //     ${person.location}
            //     </td>
            //     <td class="align-middle text-nowrap d-none d-md-table-cell">
            //     ${person.email}
            //     </td>
            //     <td class="text-end text-nowrap">
            //     <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id=${person.id}>
            //         <i class="fa-solid fa-pencil fa-fw"></i>
            //     </button>
            //     <button type="button" class="btn btn-primary btn-sm deletePersonnelBtn" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-id=${person.id}>
            //         <i class="fa-solid fa-trash fa-fw"></i>
            //     </button>
            //     </td>
            //   </tr>
            //   `
            // )
          })
          $('#personnelTableBody').append(frag);

        }
        else{
          setAlert(res.status.description)
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        setAlert(errorThrown)
        
      }
    })
  }

  // Get all Departments
  const getAllDepartments = ()=>{ 
    $.ajax({
      url:"php/getAllDepartments.php",
      type: "GET",
      dataType: "json",
      success:function(res){
        let rows = ""
        if(res.status.code === "200"){
          res.data.forEach(item =>{
            rows+=
              `
              <tr>
                <td class="align-middle text-nowrap">
                ${item.departmentName}
                </td>
                <td class="align-middle text-nowrap d-none d-md-table-cell">
                ${item.locationName}
                </td>
                <td class="align-middle text-end text-nowrap"> 
                <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id=${item.ID}>
                    <i class="fa-solid fa-pencil fa-fw"></i>
                </button>
                <button type="button" class="btn btn-primary btn-sm deleteDepartmentBtn" data-id=${item.ID}>
                    <i class="fa-solid fa-trash fa-fw"></i>
                </button>
                </td>
              </tr> 
              `
              $("#filterPersonnelByDepartment").append(
                $("<option>", {
                  value: item.ID,
                  text: item.departmentName
                })
              );
          })
          $("#departmentTableBody").empty()
          $("#departmentTableBody").append(rows)
        }
        else{
          setAlert(res.status.description)
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        setAlert(errorThrown)
      }
    })
  }

  // Get all Locations
  const getAllLocations = ()=>{
    $.ajax({
      url:"php/getAllLocations.php",
      type: "GET",
      dataType: "json",
      success:function(res){
        if(res.status.code === "200"){
          let rows = ""
          res.data.forEach(location=>{
            rows+=`
              <tr>
                <td class="align-middle text-nowrap">
                ${location.name}
                </td>
                <td class="align-middle text-end text-nowrap">
                <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id=${location.id}>
                    <i class="fa-solid fa-pencil fa-fw"></i>
                </button>
                <button type="button" class="btn btn-primary btn-sm deleteLocationBtn"  data-id=${location.id}>
                    <i class="fa-solid fa-trash fa-fw"></i>
                </button>
                </td>
              </tr>
              `
              $("#filterPersonnelByLocation").append(
                $("<option>", {
                  value: location.id,
                  text: location.name
                })
              );
          })
          $("#locationTableBody").empty()
          $("#locationTableBody").append(rows)
        }
        
        else{
          setAlert(res.status.description)
          
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        setAlert(errorThrown)
        
      }
    }) 
  }

  getAllPersonnel()
  getAllDepartments()
  getAllLocations()

  

  const SearchPersonnel = () =>{
    $("#personnelTableBody").empty()
    let txt = $("#searchInp").val()
    $.ajax({
      url:"php/SearchAll.php",
      type: "POST",
      dataType: "json",
      data: {
        txt:txt
      },
      success:function(res){
        if(res.status.code === "200"){
          var frag = document.createDocumentFragment();
          res.data.found.forEach(person =>{
            $("#personnelTableBody").empty()
  
              var row = document.createElement("tr");
  
              var name = document.createElement("td");
              name.classList = "align-middle text-nowrap";
              var nameText = document.createTextNode(`${person.firstName}, ${person.lastName}`);
              name.append(nameText);
              row.append(name);
              
              var department = document.createElement("td");
              var departmentText = document.createTextNode(person.departmentName);
              department.classList = "align-middle text-nowrap";
              department.append(departmentText);
              row.append(department);
  
              var location = document.createElement("td");
              var locationText = document.createTextNode(person.locationName);
              location.classList = "align-middle text-nowrap";
              location.append(locationText);
              row.append(location);
  
              var email = document.createElement("td");
              var emailText = document.createTextNode(person.email);
              email.classList = "align-middle text-nowrap";
              email.append(emailText);
              row.append(email);
              
  
              var btnTD = document.createElement("td");
              btnTD.classList = "text-end text-nowrap";
  
              var btn1 = document.createElement("button");
              btn1.classList = "btn btn-primary btn-sm m-1"
              btn1.setAttribute("data-bs-toggle", "modal")
              btn1.setAttribute("type", "button")
              btn1.setAttribute("data-bs-target","#editPersonnelModal")
              btn1.setAttribute("data-bs-target","#editPersonnelModal")
              btn1.setAttribute("data-id",person.id)
              var icon1 = document.createElement("i")
              icon1.classList = "fa-solid fa-pencil fa-fw";
              btn1.append(icon1)
  
              var btn2 = document.createElement("button");
              btn2.classList = "btn btn-primary btn-sm"
              btn2.setAttribute("type", "button")
              btn2.setAttribute("data-bs-toggle", "modal")
              btn2.setAttribute("data-bs-target","#deletePersonnelModal")
              btn2.setAttribute("data-id",person.id)
              var icon2 = document.createElement("i");
              icon2.classList = "fa-solid fa-trash fa-fw";
              btn2.append(icon2)
  
              btnTD.append(btn1);
              btnTD.append(btn2);
              row.append(btnTD);    
                        
              frag.append(row);
          })
          $('#personnelTableBody').append(frag);
        }
        else{
          setAlert(res.status.description)
          
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        setAlert(errorThrown)
        
      }
    })
  }

  const SearchDepartments = () =>{
    $("#departmentTableBody").empty()
    let txt = $("#searchInp").val()
    $.ajax({
      url:"php/SearchDepartment.php",
      type: "POST",
      dataType: "json",
      data: {
        txt:txt
      },
      success:function(res){
        if(res.status.code === "200"){
          res.data.found.forEach(department =>{
            $.ajax({
              url:"php/getLocationByID.php",
              type: "POST",
              dataType: "json",
              data:{
                id: department.locationID
              },
              success:function(res2){
                if(res2.status.code === "200"){
                  $("#departmentTableBody").append(
                    `
                    <tr>
                      <td class="align-middle text-nowrap">
                      ${department.department_name}
                      </td>
                      <td class="align-middle text-nowrap d-none d-md-table-cell">
                      ${department.location_name}
                      </td>
                      <td class="align-middle text-end text-nowrap"> 
                      <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id=${department.id}>
                          <i class="fa-solid fa-pencil fa-fw"></i>
                      </button>
                      <button type="button" class="btn btn-primary btn-sm deleteDepartmentBtn" data-id=${department.department_ID}>
                          <i class="fa-solid fa-trash fa-fw"></i>
                      </button>
                      </td>
                    </tr> 
                    `
                  )
                }
              },
              error: function (jqXHR, textStatus, errorThrown) {}
            })
          })
        }
        else{
          setAlert(res.status.description)
          
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        setAlert(errorThrown)
        
      }
    })
  }

  const SearchLocation = () => {
    $("#locationTableBody").empty()
    let txt = $("#searchInp").val()
    $.ajax({
      url:"php/SearchLocation.php",
      type: "POST",
      dataType: "json",
      data: {
        txt:txt
      },
      success:function(res){
        if(res.status.code === "200"){
          res.data.found.forEach(location=>{
            $("#locationTableBody").append(
              `
              <tr>
                <td class="align-middle text-nowrap">
                ${location.name}
                </td>
                <td class="align-middle text-end text-nowrap">
                <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id=${location.id}>
                    <i class="fa-solid fa-pencil fa-fw"></i>
                </button>
                <button type="button" class="btn btn-primary btn-sm deleteLocationBtn"  data-id=${location.id}>
                    <i class="fa-solid fa-trash fa-fw"></i>
                </button>
                </td>
              </tr>
              `
            )
          })
        }
        else{
          setAlert(res.status.description)
          
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        setAlert(errorThrown)
        
      }
    })
  }

  $("#searchInp").on("keyup", function (e) {
    if ($("#personnelBtn").hasClass("active")) {
      SearchPersonnel()
      
    } else {
      
      if ($("#departmentsBtn").hasClass("active")) {
        
        // Refresh department table
        SearchDepartments()
        
      } else {
        SearchLocation()
        // Refresh location table
        
      }
      
    }
    // your code
    
  });
  
  $("#refreshBtn").click(function () {
    $("#searchInp").val("")
    if ($("#personnelBtn").hasClass("active")) {
      
      // Refresh personnel table
      $("#personnelTableBody").empty()
      getAllPersonnel()
      
    } else {
      
      if ($("#departmentsBtn").hasClass("active")) {
        
        // Refresh department table
        $("#departmentTableBody").empty()
        getAllDepartments()
        
      } else {
        
        // Refresh location table
        $("#locationTableBody").empty()
        getAllLocations()
        
      }
      
    }
    
  });
  
  $("#filterBtn").click(function () {
    
  });
  
  $("#addBtn").click(function () {
    // Replicate the logic of the refresh button click to open the add modal for the table that is currently on display
    
  });

  $("#filterPersonnelByDepartment").change(function () {
  
    if (this.value > 0) {
      $("#filterPersonnelByLocation").val(0);
      // apply Filter

      $.ajax({
        url:"php/filterByDepartment.php",
        type: "POST",
        dataType: "json",
        data: {
          id: this.value
        },
        success: function (res) {
          if(res.status.code === "200"){
            $("#personnelTableBody").empty()
            var frag = document.createDocumentFragment();
  
            res.data.forEach(person =>{
              var row = document.createElement("tr");
  
              var name = document.createElement("td");
              name.classList = "align-middle text-nowrap";
              var nameText = document.createTextNode(`${person.firstName}, ${person.lastName}`);
              name.append(nameText);
              row.append(name);
              
              var department = document.createElement("td");
              var departmentText = document.createTextNode(person.department);
              department.classList = "align-middle text-nowrap";
              department.append(departmentText);
              row.append(department);
  
              var location = document.createElement("td");
              var locationText = document.createTextNode(person.location);
              location.classList = "align-middle text-nowrap";
              location.append(locationText);
              row.append(location);
  
              var email = document.createElement("td");
              var emailText = document.createTextNode(person.email);
              email.classList = "align-middle text-nowrap";
              email.append(emailText);
              row.append(email);
              
  
              var btnTD = document.createElement("td");
              btnTD.classList = "text-end text-nowrap";
  
              var btn1 = document.createElement("button");
              btn1.classList = "btn btn-primary btn-sm m-1"
              btn1.setAttribute("data-bs-toggle", "modal")
              btn1.setAttribute("type", "button")
              btn1.setAttribute("data-bs-target","#editPersonnelModal")
              btn1.setAttribute("data-bs-target","#editPersonnelModal")
              btn1.setAttribute("data-id",person.id)
              var icon1 = document.createElement("i")
              icon1.classList = "fa-solid fa-pencil fa-fw";
              btn1.append(icon1)
  
              var btn2 = document.createElement("button");
              btn2.classList = "btn btn-primary btn-sm"
              btn2.setAttribute("type", "button")
              btn2.setAttribute("data-bs-toggle", "modal")
              btn2.setAttribute("data-bs-target","#deletePersonnelModal")
              btn2.setAttribute("data-id",person.id)
              var icon2 = document.createElement("i");
              icon2.classList = "fa-solid fa-trash fa-fw";
              btn2.append(icon2)
  
              btnTD.append(btn1);
              btnTD.append(btn2);
              row.append(btnTD);    
                        
              frag.append(row);
            })
            $('#personnelTableBody').append(frag);
  
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR.responseText)
        }
      });
        
    }
    if($("#filterPersonnelByLocation").val() == 0 && $("#filterPersonnelByDepartment").val() == 0){
      getAllPersonnel()
    }
})

  $("#filterPersonnelByLocation").change(function () {
    
      if (this.value > 0) {
        $("#filterPersonnelByDepartment").val(0);
        $.ajax({
          url:"php/filterByLocation.php",
          type: "POST",
          dataType: "json",
          data: {
            id: this.value
          },
          success: function (res) {
            if(res.status.code === "200"){
              $("#personnelTableBody").empty()
              var frag = document.createDocumentFragment();
    
              res.data.forEach(person =>{
                var row = document.createElement("tr");
    
                var name = document.createElement("td");
                name.classList = "align-middle text-nowrap";
                var nameText = document.createTextNode(`${person.firstName}, ${person.lastName}`);
                name.append(nameText);
                row.append(name);
                
                var department = document.createElement("td");
                var departmentText = document.createTextNode(person.department);
                department.classList = "align-middle text-nowrap";
                department.append(departmentText);
                row.append(department);
    
                var location = document.createElement("td");
                var locationText = document.createTextNode(person.location);
                location.classList = "align-middle text-nowrap";
                location.append(locationText);
                row.append(location);
    
                var email = document.createElement("td");
                var emailText = document.createTextNode(person.email);
                email.classList = "align-middle text-nowrap";
                email.append(emailText);
                row.append(email);
                
    
                var btnTD = document.createElement("td");
                btnTD.classList = "text-end text-nowrap";
    
                var btn1 = document.createElement("button");
                btn1.classList = "btn btn-primary btn-sm m-1"
                btn1.setAttribute("data-bs-toggle", "modal")
                btn1.setAttribute("type", "button")
                btn1.setAttribute("data-bs-target","#editPersonnelModal")
                btn1.setAttribute("data-bs-target","#editPersonnelModal")
                btn1.setAttribute("data-id",person.id)
                var icon1 = document.createElement("i")
                icon1.classList = "fa-solid fa-pencil fa-fw";
                btn1.append(icon1)
    
                var btn2 = document.createElement("button");
                btn2.classList = "btn btn-primary btn-sm"
                btn2.setAttribute("type", "button")
                btn2.setAttribute("data-bs-toggle", "modal")
                btn2.setAttribute("data-bs-target","#deletePersonnelModal")
                btn2.setAttribute("data-id",person.id)
                var icon2 = document.createElement("i");
                icon2.classList = "fa-solid fa-trash fa-fw";
                btn2.append(icon2)
    
                btnTD.append(btn1);
                btnTD.append(btn2);
                row.append(btnTD);    
                          
                frag.append(row);
              })
              $('#personnelTableBody').append(frag);
    
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText)
          }
        });
        // apply Filter
      }
      if($("#filterPersonnelByLocation").val() == 0 && $("#filterPersonnelByDepartment").val() == 0){
        getAllPersonnel()
      }
  })
  
  $("#personnelBtn").click(function () {
    $("#addBtn").attr("data-bs-target","#addPersonnelModal")
    $("#refreshBtn").trigger("click")
    $("#filterBtn").attr("disabled", false);
    // Call function to refresh personnel table
    
  });
  
  $("#departmentsBtn").click(function () {
    $("#addBtn").attr("data-bs-target","#addDepartmentModal")
    $("#refreshBtn").trigger("click")
    $("#filterBtn").attr("disabled", true);
    
  });
  
  $("#locationsBtn").click(function () {
    $("#addBtn").attr("data-bs-target","#addLocationModal")
    $("#refreshBtn").trigger("click")
    $("#filterBtn").attr("disabled", true);
    // Call function to refresh location table
    
  });
  
  // :EDIT
  $("#editPersonnelModal").on("show.bs.modal", function (e) {
    $.ajax({
      url:
        "php/getPersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: $(e.relatedTarget).attr("data-id") 
      },
      success: function (result) {
        $("#editPersonnelForm").attr('data-id',$(e.relatedTarget).attr("data-id"));
        var resultCode = result.status.code;
        if (resultCode == 200) {
          
          // Update the hidden input with the employee id so that
          // it can be referenced when the form is submitted
  
          $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);
  
          $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
          $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
          $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
          $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);
  
          $("#editPersonnelDepartment").html("");
  
          $.each(result.data.department, function () {
            $("#editPersonnelDepartment").append(
              $("<option>", {
                value: this.id,
                text: this.name
              })
            );
          });
  
          $("#editPersonnelDepartment").val(result.data.personnel[0].departmentID);
          
        } else {
          // $("#editPersonnelModal .modal-title").replaceWith(
          //   "Error retrieving data"
          // );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // $("#editPersonnelModal .modal-title").replaceWith(
        //   "Error retrieving data"
        // );
      }
    });
  });

  $("#editDepartmentModal").on("show.bs.modal", function (e) {
    $("#editDepartmentForm").attr('data-id',$(e.relatedTarget).attr("data-id"));
    $.ajax({
      url:"php/getDepartmentByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: $(e.relatedTarget).attr("data-id") 
      },
      success: function (res) {
        if (res.status.code === "200") {
          $("#editDepartmentName").val(res.data[0].name);
          // $("#editDepartmentLocation").html("");
          $.ajax({
            url:"php/getAllLocations.php",
            type: "GET",
            dataType: "json",
            success:function(resLoc){
              if(resLoc.status.code === "200"){
                $.each(resLoc.data, function () {
                  $("#editDepartmentLocation").append(
                    $("<option>", {
                      value: this.id,
                      text: this.name
                    })
                  );
                });
                $("#editDepartmentLocation").val(res.data[0].locationID);
              }
            },
            error: function (jqXHR, textStatus, errorThrown) {
              setAlert(errorThrown)
              
            }
          })          
        } else {
          // $("#editDepartmentModal .modal-title").replaceWith(
          //   "Error retrieving data"
          // );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // $("#editDepartmentModal .modal-title").replaceWith(
        //   "Error retrieving data"
        // );
      }
    });
  });

  $("#editLocationModal").on("show.bs.modal", function (e) {
    $("#editLocationForm").attr('data-id',$(e.relatedTarget).attr("data-id"));
    $.ajax({
      url:"php/getLocationByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: parseInt($(e.relatedTarget).attr("data-id"))
      },
      success: function (res) {
        if (res.status.code === "200") {
          $("#editLocationName").val(res.data[0].name)
        } else {
          // $("#editDepartmentModal .modal-title").replaceWith(
          //   "Error retrieving data"
          // );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        setAlert(errorThrown)
        
        // $("#editDepartmentModal .modal-title").replaceWith(
        //   "Error retrieving data"
        // );
      }
    });
  });
  
  // :ADD
  $("#addPersonnelModal").on("show.bs.modal", function (e) {
    $.ajax({
      url:
        "php/getAllDepartments.php",
      type: "GET",
      dataType: "json",
      success: function (res) {
        $("#addPersonnelDepartment").html("")
        if (res.status.code === "200") {
          $.each(res.data, function () {
            // console.log(res.data)
            $("#addPersonnelDepartment").append(
              $("<option>", {
                value: this.ID,
                text: this.departmentName
              })
            );
          });
        } else {
          // $("#addPersonnelModal .modal-title").replaceWith(
          //   "Error retrieving data"
          // );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        setAlert(errorThrown)
        
        // $("#addPersonnelModal .modal-title").replaceWith(
        //   "Error retrieving data"
        // );
      }
    });
  });

  $("#addDepartmentModal").on("show.bs.modal", function (e) {
    $.ajax({
      url:
        "php/getAllLocations.php",
      type: "GET",
      dataType: "json",
      success: function (res) {
        if (res.status.code === "200") {
          $("#addDepartmentLocation").empty()
          $.each(res.data, function () {
            $("#addDepartmentLocation").append(
              $("<option>", {
                value: this.id,
                text: this.name
              })
            );
          });
        } else {
          // $("#addDepartmentModal .modal-title").replaceWith(
          //   "Error retrieving data"
          // );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        setAlert(errorThrown)
        
        // $("#addDepartmentModal .modal-title").replaceWith(
        //   "Error retrieving data"
        // );
      }
    });
  });

  $("#addLocationModal").on("show.bs.modal", function (e) {

  });
  
  // :DELETE
  $("#deletePersonnelModal").on("show.bs.modal", function (e) {
    $("#deletePersonnelForm").attr('data-id',$(e.relatedTarget).attr("data-id"));
    $.ajax({
      url:
        "php/getPersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: $(e.relatedTarget).attr("data-id") 
      },
      success: function (result) {
        $("#editPersonnelForm").attr('data-id',$(e.relatedTarget).attr("data-id"));
        var resultCode = result.status.code;
        if (resultCode == 200) {
          let user = result.data.personnel[0]
          $("#deletePersonnelQuestion").html(`Are you sure that you want to remove the entry for <strong>${user.lastName}, ${user.firstName} </strong>?`)
        } else {

        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
      

      }
    });
  });

  $(document).on("click", ".deleteDepartmentBtn", function() {
    let departmentId = $(this).data("id");
    let dpName = ""
    $.ajax({
      url:"php/getDepartmentDependencyCount.php",
      type: "POST",
      dataType: "json",
      data:{
        id: parseInt(departmentId)
      },
      success: function(res) {
        if(res.status.code === "200"){
          let personnelCount = res.data.personnel[0].personnelCount
          $.ajax({
            url:"php/getDepartmentByID.php",
            type: "POST",
            dataType: "json",
            data: {
              id: departmentId
            },
            success: function (res2) {
              if (res2.status.code === "200") {
                if(personnelCount > 0){
                  $("#warningModal").modal("show")
                  $("#dependency-warining").html(`
                  You cannot remove <strong>${res2.data[0].name}</strong> because it has <strong>${personnelCount} ${personnelCount > 1 ? "employees" : "employee"} </strong> assigned to it.`)
                }
                else{
                  $("#deleteDepartmentForm").attr('data-id',departmentId);
                  $("#removeDepartmentQuestion").html(`Are you sure you want to delete the entry for <strong>${res2.data[0].name}</strong> ?`);
                  $("#deleteDepartmentModal").modal("show")
                }
              }
              },
            error: function (jqXHR, textStatus, errorThrown) {
              // $("#editDepartmentModal .modal-title").replaceWith(
              //   "Error retrieving data"
              // );
            }
          });

        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        setAlert(errorThrown)
        
      }
    })
  });

  $(document).on("click", ".deleteLocationBtn", function() {
    let locationId = $(this).data("id");
    $.ajax({
      url:"php/getLocationDependencyCount.php",
      type: "POST",
      dataType: "json",
      data:{
        id: parseInt(locationId)
      },
      success: function(res) {
        if(res.status.code === "200"){
          if(res.data[0].department_count > 0){
            $("#warningModal").modal("show")
            $("#dependency-warining").html(`
            You cannot remove <strong>${res.data[0].location_name} </strong> because it has <strong>${res.data[0].department_count} ${res.data[0].department_count > 1  ? "departments" : "department"} </strong> assigned to it.`)
            return
          }
          else{
            $("#deleteLocForm").attr('data-id',res.data[0].locationID);
            $("#removeLocationQuestion").html(`Are you sure you want to remove <strong>${res.data[0].location_name}</strong>?`)
            $("#deleteLocationModal").modal("show")
          }
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        setAlert(errorThrown)
        
      }
    })
  });

  $("#deleteLocationModal").on("show.bs.modal", function (e) {
    $("#deleteLocForm").attr('data-id',$(e.relatedTarget).attr("data-id"));
  });


  // SUBMITS

  
  // :EDIT
  $("#editPersonnelForm").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      url:
        "php/UpdatePersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: parseInt($('#editPersonnelForm').attr("data-id")),
        lastName: $("#editPersonnelLastName").val(),
        firstName: $("#editPersonnelFirstName").val(),
        department: parseInt($('#editPersonnelDepartment').val()) ,
        email: $("#editPersonnelEmailAddress").val(),
        jobTitle: $("#editPersonnelJobTitle").val(),
      },
      success: function (res) {
        if(res.status.code === "200"){
          $("#refreshBtn").trigger("click")
        }
        else{
          setAlert(res.status.description)
          
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        setAlert(errorThrown)
        
      }
      })
  
    // AJAX call to save form data
    
  });

  $("#editDepartmentForm").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      url:"php/UpdateDepartmentByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: parseInt($('#editDepartmentForm').attr("data-id")),
        name:$("#editDepartmentName").val(),
        locationID:$("#editDepartmentLocation").val()
      },
      success: function (res) {
        if(res.status.code === "200"){
          $("#refreshBtn").trigger("click")
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        setAlert(errorThrown)
        
      }
      })
  
    // AJAX call to save form data
    
  });

  $("#editLocationForm").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      url:"php/UpdateLocationByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: parseInt($("#editLocationForm").attr("data-id")),
        name:$("#editLocationName").val(),
      },
      success: function (res) {
        if(res.status.code === "200"){
          $("#refreshBtn").trigger("click")
        }
        else{
          setAlert(res.status.description)
          
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        setAlert(errorThrown)
        
      }
    })
  
    // AJAX call to save form data
    
  });

  // :ADD
  $("#addPersonnelForm").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      url:"php/insertPersonnel.php",
      type: "POST",
      dataType: "json",
      data: {
        lastName:$("#addPersonnelLastName").val(),
        firstName:$("#addPersonnelFirstName").val(),
        department:parseInt($('#addPersonnelDepartment').val()),
        email:$("#addPersonnelEmailAddress").val(),
        jobTitle: $("#addPersonnelJobTitle").val(),
      },
      success: function(res){
        if(res.status.code === "200"){
          $("#refreshBtn").trigger("click")
        }
        else{
          setAlert(res.status.description)
          
        }
        $("#addPersonnelLastName").val("")
        $("#addPersonnelFirstName").val("")
        $("#addPersonnelEmailAddress").val("")
        $("#addPersonnelJobTitle").val("")

      },
      error: function (jqXHR, textStatus, errorThrown) {
        setAlert(errorThrown)
        
      }
    })
  })

  $("#addLocationForm").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      url:"php/insertLocation.php",
      type: "POST",
      dataType: "json",
      data:{
        name: $("#addLocationName").val()
      },
      success: function (res) {
        if (res.status.code === "200") {
          $("#refreshBtn").trigger("click")
        } else {
          // $("#addDepartmentModal .modal-title").replaceWith(
          //   "Error retrieving data"
          // );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        setAlert(errorThrown)
        
        // $("#addDepartmentModal .modal-title").replaceWith(
        //   "Error retrieving data"
        // );
        
      }
    });
  })

  $("#addDepartmentForm").on("submit",function (e){
    e.preventDefault();
    $.ajax({
      url: "php/insertDepartment.php",
      type: "POST",
      dataType: "json",
      data: {
        name: $("#addDepartmentName").val(),
        locationID: parseInt($("#addDepartmentLocation").val()),
      },
      success: function(res){
        if(res.status.code === "200"){
          if(res.data.length > 0){
            setAlert("This department Already exits in the selected location.")
          }
          else{
            $("#refreshBtn").trigger("click")
          }
        }
        else{
          setAlert(res.status.description)
          
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        setAlert(errorThrown)
        
      }
    })
  })

  // :DELETE
  $("#deletePersonnelForm").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      url: "php/deletePersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id:parseInt($("#deletePersonnelForm").attr('data-id'))
      },
      success: function(res){
        if(res.status.code === "200"){
          $("#refreshBtn").trigger("click")
        }
        else{
          setAlert(res.status.description)
          
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        setAlert(errorThrown)
        
      }
    })
  })

  $("#deleteDepartmentForm").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      url:"php/getDepartmentDependencyCount.php",
      type: "POST",
      dataType: "json",
      data:{
        id:parseInt($("#deleteDepartmentForm").attr('data-id'))
      },
      success: function(res) {
        if(res.status.code === "200"){
          if(res.data.personnel[0].personnel_count > 0){
            $("#warningModal").show()
            // $("dependency-warining")
            return
          }
          else{
            $.ajax({
              url: "php/deleteDepartmentByID.php",
              type: "POST",
              dataType: "json",
              data: {
                id:parseInt($("#deleteDepartmentForm").attr('data-id'))
              },
              success: function(res2){
                if(res2.status.code === "200"){
                  $("#refreshBtn").trigger("click")
                }
                else{
                  setAlert(res.status.description)
                  
                }
              },
              error: function (jqXHR, textStatus, errorThrown) {
                setAlert(errorThrown)
                
              }
            })
          }
        }
        else{
          setAlert(res.status.description)
          
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        
      }
    })
  })

  $("#deleteLocForm").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      url: "php/deleteLocationByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id:parseInt($("#deleteLocForm").attr('data-id'))
      },
      success: function(res){
        if(res.status.code === "200"){
          $("#refreshBtn").trigger("click")
        }
        else{
          setAlert(res.status.description)
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        setAlert(errorThrown)
        
      }
    })
  })

  const setAlert = (msg) =>{
    const alret = $("#alert")
    // alret.html(msg)
    alret.show()
    setTimeout(()=>{
      alret.hide()
    },3000)
  }
})  