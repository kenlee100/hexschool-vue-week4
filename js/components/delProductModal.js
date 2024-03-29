import config from "../config.js";
export default {
  props: {
    tempContent: {
      type: Object,
      default: {},
    },
  },
  methods: {
    deleteItem(id) {
      axios
        .delete(`${config.url}/api/${config.path}/admin/product/${id}`)
        .then((res) => {
          // 外層傳入 取得所有商品
          this.$emit("update-data");
          this.closeModal();
          alert(res.data.message);
        })
        .catch((err) => {
          // 顯示失敗資訊
          alert(err.data.message);
        });
    },
    // 觸發外層關閉modal事件
    closeModal() {
      this.$emit("close-modal", "#delProductModal");
    },
  },
  template: `
    <div
      id="delProductModal"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="delProductModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 id="delProductModalLabel" class="modal-title">
              <span>刪除產品</span>
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            是否刪除
            <strong class="text-danger">{{ tempContent.title }}</strong>
            商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="closeModal"
              >
              取消
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="deleteItem(tempContent.id)"
            >
              確認刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
};
