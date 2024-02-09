$(document).ready(function () {
  const selectParent = tomSelectInit('#modal-menu select[name="id_parent"]');

  $("button[id=btn-add]").on("click", function () {
    $('#modal-menu input[name="id"]').val("");
    $('#modal-menu input[name="name"]').val("");
    $('#modal-menu input[name="slug"]').val("");
    $('#modal-menu select[name="type"]').val("");
    selectParent.setValue("");
    $('#modal-menu input[name="order"]').val("");
    $("#modal-menu").modal("show");
  });

  $("#modal-menu select[name=type]").on("change", function () {
    const val = $(this).val();
    $("#modal-menu select[name=id_parent]").prop("disabled", val != "child");
    if (val == "child") {
      selectParent.unlock();
    } else {
      $("#modal-menu select[name=id_parent]").val("").change();
      selectParent.lock();
    }
  });

  $("#form-menu").on("submit", function (e) {
    e.preventDefault();
    let formData = new FormData($(this)[0]);
    const id = $("#form-menu input[name=id]").val();

    const post = () => {
      ajax_post({
        url: !is_not_empty(id) ? "/menu/store" : "/menu/update",
        data: formData,
        processData: false,
        contentType: false,
        success: function (result) {
          Swal.close();
          if (result.code == 200) {
            show_success({
              html: result.message ?? "Data berhasil disimpan",
              didClose: function () {
                location.reload();
              },
            });
          } else {
            show_error({
              html: result.message ?? "Data gagal disimpan",
            });
          }
        },
      });
    };

    prompt_swal(post);
  });

  $("#modal-menu #btn-save").on("click", function () {
    const form = $("#form-menu");
    // Trigger HTML5 validity.
    const reportValidity = form[0].reportValidity();
    // Check if menu parent is not same with menu that edited.
    const id = $('#modal-menu input[name="id"]').val();
    const idParent = $('#modal-menu select[name="id_parent"]').val();
    if (is_not_empty(id) && id == idParent) {
      show_error({
        html: "Menu parent tidak boleh sama dengan menu yang diedit",
      });
      return;
    }
    // Then submit if form is OK.
    if (reportValidity) {
      form.submit();
    }
  });

  const table = new DataTable("#table", {
    processing: true,
    serverSide: true,
    ordering: false,
    ajax: {
      url: "/menu/data",
      type: "GET",
    },
    columns: [
      {
        data: "name",
      },
      {
        data: "slug",
      },
      {
        data: "parent",
        render: function (data, type, row) {
          if (is_not_empty(data)) {
            return data.name;
          }
          return "-";
        },
      },
      {
        data: "id",
        render: function (data, type, row) {
          return `
            <div class="d-flex flex-row gap-2">
                <button type="button" class="btn btn-primary btn-edit">
                <img class="icon" src="/img/icons/edit.svg">
                </button>
                <button type="button" class="btn btn-secondary btn-edit-user">
                <img class="icon" src="/img/icons/eye-edit.svg">
                </button>
                <button type="button" class="btn btn-danger btn-delete">
                <img class="icon" src="/img/icons/trash-x.svg">
                </button>
            </div>
            `;
        },
      },
    ],
  });

  $("#table tbody").on("click", "button.btn-edit", function () {
    const data = table.row($(this).closest("tr")).data();

    $('#modal-menu input[name="id"]').val(data.id);
    $('#modal-menu input[name="name"]').val(data.name);
    $('#modal-menu input[name="slug"]').val(data.slug);
    $('#modal-menu select[name="type"]').val(data.type).change();
    selectParent.setValue(data.id_parent);
    $('#modal-menu input[name="order"]').val(data.order);

    $("#modal-menu").modal("show");
  });

  $("#table tbody").on("click", "button.btn-edit-user", function () {
    const data = table.row($(this).closest("tr")).data();
    //set menu name
    $("#modal-menu-user input[name=id_menu]").val(data.id);
    $("#modal-menu-user input[name=name]").val(data.name);
    //clear all checkbox
    $('#modal-menu-user input[type="checkbox"]').prop("checked", false);
    //set menu checked base on level key in data
    data.level.forEach((level) => {
      //   console.log(level);
      $(`#modal-menu-user input[type="checkbox"][value=${level.level}]`).prop(
        "checked",
        true
      );
    });
    //show modal
    $("#modal-menu-user").modal("show");
  });

  $("#table tbody").on("click", "button.btn-delete", function () {
    const data = table.row($(this).closest("tr")).data();

    const post = () => {
      ajax_post({
        url: "/menu/destroy",
        data: {
          id: data.id,
        },
        success: function (result) {
          Swal.close();
          if (result.code == 200) {
            show_success({
              html: result.message ?? "Data berhasil dihapus",
              didClose: function () {
                location.reload();
              },
            });
          } else {
            show_error({
              html: result.message ?? "Data gagal dihapus",
            });
          }
        },
      });
    };

    prompt_swal(post, textDelete);
  });

  $("#form-menu-user").on("submit", function (e) {
    e.preventDefault();
    let formData = new FormData($(this)[0]);
    const post = () => {
      ajax_post({
        url: "/menu/store-user",
        data: formData,
        processData: false,
        contentType: false,
        success: function (result) {
          Swal.close();
          if (result.code == 200) {
            show_success({
              html: result.message ?? "Data berhasil disimpan",
              didClose: function () {
                $("#modal-menu-user").modal("hide");
                table.ajax.reload();
              },
            });
          } else {
            show_error({
              html: result.message ?? "Data gagal disimpan",
            });
          }
        },
      });
    };

    prompt_swal(post);
  });

  $("#modal-menu-user #btn-save").on("click", function () {
    const form = $("#form-menu-user");
    // Trigger HTML5 validity.
    const reportValidity = form[0].reportValidity();
    // Check if menu parent is not same with menu that edited.
    // Then submit if form is OK.
    if (reportValidity) {
      form.submit();
    }
  });
});
