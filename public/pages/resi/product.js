$(document).ready(function () {
  $("button[id=btn-import]").on("click", function () {
    $("#modal-import").modal("show");
  });

  $("#form-import").on("submit", function (e) {
    e.preventDefault();
    let formData = new FormData($(this)[0]);

    const post = () => {
      ajax_post({
        url: "/resi-product/import",
        data: formData,
        processData: false,
        contentType: false,
        success: function (result) {
          Swal.close();
          if (result.code == 200) {
            show_success({
              html: result.message ?? "Data berhasil disimpan",
              didClose: function () {
                $("#modal-import").modal("hide");
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

  $("#modal-import #btn-save").on("click", function () {
    const form = $("#form-import");
    // Trigger HTML5 validity.
    const reportValidity = form[0].reportValidity();
    // Then submit if form is OK.
    if (reportValidity) {
      form.submit();
    }
  });

  const table = new DataTable("#table", {
    ajax: {
      url: "/resi-product/data",
      type: "GET",
      data: function (d) {
        d.start_date = $("#start_date").val();
        d.end_date = $("#end_date").val();
      },
    },
    columns: [
      {
        data: "resi_no",
      },
      {
        data: "courir",
      },
      {
        data: "created_date",
      },
      {
        data: "count_product",
      },
      {
        data: "resi_no",
        render: function (data, type, row) {
          return `
            <div class="d-flex flex-row gap-2">
                <button type="button" class="btn btn-primary btn-view">
                    <img class="icon" src="/img/icons/eye-check.svg">
                </button>
                <button type="button" class="btn btn-danger btn-delete">
                    <img class="icon" src="/img/icons/trash-x.svg">
                </button>
            </div>
            `;
        },
        orderable: false,
      },
    ],
  });

  $("#table tbody").on("click", "button.btn-view", function () {
    const data = table.row($(this).parents("tr")).data();

    const row = (item) => {
      return `
        <tr>
            <td>${item.barcode}</td>
            <td>${item.name}</td>
            <td>${item.qty}</td>
        </tr>
        `;
    };

    const customOption = {
      url: "/resi-product/data-detail",
      data: {
        resi_no: data.resi_no,
      },
      type: "GET",
      success: function (result) {
        Swal.close();
        $("#table-detail tbody").html("");

        for (const item of result.data) {
          $("#table-detail tbody").append(row(item));
        }

        $("#modal-detail").modal("show");
      },
    };

    console.log(customOption);

    ajax_post(customOption);
  });

  $("#table tbody").on("click", "button.btn-delete", function () {
    const data = table.row($(this).closest("tr")).data();

    const post = () => {
      ajax_post({
        url: "/resi-product/destroy",
        data: {
          resi_no: data.resi_no,
        },
        success: function (result) {
          Swal.close();
          if (result.code == 200) {
            show_success({
              html: result.message ?? "Data berhasil dihapus",
              didClose: function () {
                table.ajax.reload();
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

  $("#btn-filter").on("click", function () {
    table.ajax.reload();
  });
});
