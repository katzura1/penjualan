$(document).ready(function () {
  const getSummary = () => {
    const date = $("#date").val();
    const url = "/report/data-summary-daily";
    const data = { date: date };
    ajax_post({
      url: url,
      type: "GET",
      data: data,
      success: (result) => {
        Swal.close();
        if (result.code == 200) {
          const row = `
            <tr>
                <td class="td-status" data-status="register" role="button">
                  <span class="badge badge-primary">${result.data.register}</span>
                </td>
                <td class="td-status" data-status="packing">
                  <span class="badge badge-primary">${result.data.packing}</span>
                </td>
                <td class="td-status" data-status="shipping">
                  <span class="badge badge-primary">${result.data.shipping}</span>
                </td>
                <td class="td-status" data-status="received">
                  <span class="badge badge-primary">${result.data.received}</span>
                </td>
                <td class="td-status" data-status="validated">
                  <span class="badge badge-primary">${result.data.validated}</span>
                </td>
            </tr>
            `;

          $("#table-summary tbody").html(row);
        }
      },
    });
  };

  $("#date").on("change", function () {
    getSummary();
  });

  $("#btn-not-complete").on("click", function () {
    //validasi input date
    const date = $("#date").val();
    if (date == "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select date",
      });
      return false;
    }

    const url = "/resi-product/delete-not-complete";

    const post = () => {
      ajax_post({
        url: url,
        data: { date: date },
        success: (result) => {
          Swal.close();
          if (result.code == 200) {
            show_success({
              title: "Success",
              text: result.message,
              didClose: () => {
                getSummary();
              },
            });
          } else {
            show_error({
              title: "Error",
              text: result.message,
            });
          }
        },
      });
    };

    prompt_swal(post, {
      html: "Apakah anda yakin ingin menghapus data yang tidak lengkap ?",
    });
  });

  const showHistory = (status) => {
    $.ajax({
      url: "/resi-product/data-history",
      data: {
        date: $("#date").val() || new Date().toISOString().split("T")[0],
        status: status,
      },
      success: (res) => {
        //destroy datatable
        if ($.fn.DataTable.isDataTable("#table-detail")) {
          $("#table-detail").DataTable().destroy();
        }
        if (res.data.length > 0) {
          let html = "";
          res.data.forEach((item) => {
            html += `
              <tr>
                <td>${item.resi_no}</td>
                <td>${item.name}</td>
              </tr>
            `;
          });
          $("#table-detail tbody").html(html);

          //init datatable
          $("#table-detail").DataTable({});
          $("#modal-detail").modal("show");
        } else {
          $("#table-detail tbody").html("");
          $("#modal-detail").modal("show");
        }
      },
    });
  };

  $("#table-summary tbody").on("click", ".td-status", function () {
    const status = $(this).data("status");
    showHistory(status);
  });
});
