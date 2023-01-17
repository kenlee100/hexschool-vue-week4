export default {
  data() {
    return {
      productModal: null,
    };
  },
  props: {
    // 接收外層url
    apiUrl: {
      type: String,
      default: "",
    },
    // 接收外層path
    apiPath: {
      type: String,
      default: "",
    },
    tempContent: {
      type: Object,
      default: {},
    },
    // 接收外層isNew，判斷modal標題
    isNew: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    closeModal() {
      this.productModal.hide();
    },
    // 建立圖片欄位
    createImage() {
      // 計算圖片數量
      let count = null;

      // 有 imagesUrl 時
      if (this.tempContent.imagesUrl) {
        // 將 tempContent.imagesUrl 圖片數量賦予到count
        count = this.tempContent.imagesUrl.length;
      }

      const imageObj = {
        // timestamp,  計算目前數量
        id: new Date().getTime(),
        num: (count += 1),
      };

      // 有 imagesUrl 時
      if (this.tempContent.imagesUrl) {
        // 新增一筆物件
        this.tempContent.imagesUrl.push(imageObj);
      } else {
        // 沒有 imagesUrl 時 新增 imagesUrl 陣列 + 新增一筆物件
        this.tempContent.imagesUrl = [];
        this.tempContent.imagesUrl.push(imageObj);
      }
    },
    // 移除圖片
    deleteImage(data) {
      this.tempContent.imagesUrl.forEach((item, index) => {
        if (item.id === data.id) {
          this.tempContent.imagesUrl.splice(index, 1);
        }
      });
    },
    uploadFile(refItem) {
      const formData = new FormData();
      // 上傳主要圖片
      if (refItem === "main-file") {
        const refFiles = this.$refs[refItem];
        formData.append(refFiles.name, refFiles.files[0]);
        axios
          .post(`${this.apiUrl}/api/${this.apiPath}/admin/upload/`, formData)
          .then((res) => {
            this.tempContent.imageUrl = res.data.imageUrl;
          })
          .catch((err) => {
            alert(err.data.message);
          });
      } else {
        // 上傳其他圖片
        const refFiles = this.$refs[refItem][0];
        const i = parseInt(refFiles.dataset.num);
        formData.append(refFiles.name, refFiles.files[0]);
        axios
          .post(`${this.apiUrl}/api/${this.apiPath}/admin/upload/`, formData)
          .then((res) => {
            this.tempContent.imagesUrl[i].imageUrl = res.data.imageUrl;
          })
          .catch((err) => {
            alert(err.data.message);
          });
      }
    },
    updateProduct() {
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let method = "post";
      // 判斷 isNew 是否為 新增
      if (!this.isNew) {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempContent.id}`;
        method = "put";
      }
      axios[method](url, {
        data: this.tempContent,
      })
        .then((res) => {
          this.$emit("update-data");
          alert(res.data.message);

          this.closeModal();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
  },
  mounted() {
    this.productModal = new bootstrap.Modal("#productModal");
  },
  template: `
          <div
        id="productModal"
        ref="productModal"
        class="modal fade"
        tabindex="-1"
        aria-labelledby="productModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-xl">
          <div class="modal-content border-0">
            <div class="modal-header bg-dark text-white">
              <h5 id="productModalLabel" class="modal-title">
                <span v-if="isNew">新增產品</span>
                <span v-else>編輯產品</span>
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-sm-4">
                  <div class="mb-2">
                    <div class="mb-3">
                      <label for="imageUrl" class="form-label">主要圖片</label>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="請輸入主要圖片連結"
                        v-model="tempContent.imageUrl"
                      />
                      <div class="input-group">
                        <input
                          type="file"
                          class="form-control"
                          name="main-file-upload"
                          @change="uploadFile('main-file')"
                          ref="main-file"
                        />
                      </div>
                      <img
                        v-if="tempContent.imageUrl"
                        class="img-fluid"
                        :src="tempContent.imageUrl"
                        alt=""
                      />
                      <img
                        v-else
                        src="https://placehold.co/640x480?text=No+Photo"
                        alt=""
                      />
                    </div>
                  </div>
                  <div class="mb-3">
                    <button class="btn btn-outline-primary btn-sm d-block w-100"
                      @click="createImage"
                    >
                      新增其他圖片欄位
                    </button>
                  </div>
                  <!-- 判斷 tempContent.imagesUrl 是一個陣列 -->
                  <div
                    class="d-flex flex-column overflow-auto"
                    v-if="Array.isArray(tempContent.imagesUrl)"
                  >
                    <template
                      v-for="(item,index) in tempContent.imagesUrl"
                      :key="item.id"
                    >
                      <div class="py-3 border-bottom">
                        <label class="form-label">圖片 {{ item.num }}</label>
                        <div class="form-group">
                          <input
                            type="text"
                            class="form-control"
                            :placeholder="'請輸入圖片' + item.num + '連結'"
                            v-model="tempContent.imagesUrl[index].imageUrl"
                          />
                          <input
                            type="file"
                            class="form-control"
                            :name="'file-upload-' + (index+1)"
                            :ref="'ref-file-' +  (index+1 )"
                            @change="uploadFile('ref-file-' + (index+1))"
                            :data-num="index"
                          />
                          <img
                            v-if="item.imageUrl"
                            class="img-fluid"
                            :src="item.imageUrl"
                            alt=""
                          />
                          <img
                            v-else
                            class="img-fluid"
                            src="https://placehold.co/640x480?text=No+Photo"
                            alt=""
                          />
                        </div>
                        <div>
                          <button
                            class="btn btn-outline-danger btn-sm d-block w-100"
                            @click="deleteImage(item)"
                          >
                            刪除圖片 {{ item.num }}
                          </button>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
                <div class="col-sm-8">
                  <div class="mb-3">
                    <label for="title" class="form-label">標題</label>
                    <input
                      id="title"
                      type="text"
                      class="form-control"
                      placeholder="請輸入標題"
                      v-model="tempContent.title"
                    />
                  </div>

                  <div class="row">
                    <div class="mb-3 col-md-6">
                      <label for="category" class="form-label">分類</label>
                      <input
                        id="category"
                        type="text"
                        class="form-control"
                        placeholder="請輸入分類"
                        v-model="tempContent.category"
                      />
                    </div>
                    <div class="mb-3 col-md-6">
                      <label for="price" class="form-label">單位</label>
                      <input
                        id="unit"
                        type="text"
                        class="form-control"
                        placeholder="請輸入單位"
                        v-model="tempContent.unit"
                      />
                    </div>
                  </div>

                  <div class="row">
                    <div class="mb-3 col-md-6">
                      <label for="origin_price" class="form-label">原價</label>
                      <input
                        id="origin_price"
                        type="number"
                        min="0"
                        class="form-control"
                        placeholder="請輸入原價"
                        v-model.number="tempContent.origin_price"
                      />
                    </div>
                    <div class="mb-3 col-md-6">
                      <label for="price" class="form-label">售價</label>
                      <input
                        id="price"
                        type="number"
                        min="0"
                        class="form-control"
                        placeholder="請輸入售價"
                        v-model.number="tempContent.price"
                      />
                    </div>
                  </div>
                  <hr />

                  <div class="mb-3">
                    <label for="description" class="form-label">產品描述</label>
                    <textarea
                      id="description"
                      type="text"
                      class="form-control"
                      placeholder="請輸入產品描述"
                      v-model="tempContent.description"
                    >
                    </textarea>
                  </div>
                  <div class="mb-3">
                    <label for="content" class="form-label">說明內容</label>
                    <textarea
                      id="description"
                      type="text"
                      class="form-control"
                      placeholder="請輸入說明內容"
                      v-model="tempContent.content"
                    >
                    </textarea>
                  </div>
                  <div class="mb-3">
                    <div class="form-check">
                      <input
                        id="is_enabled"
                        class="form-check-input"
                        type="checkbox"
                        :true-value="1"
                        :false-value="0"
                        v-model="tempContent.is_enabled"
                      />
                      <label class="form-check-label" for="is_enabled"
                        >是否啟用</label
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-outline-secondary"
                data-bs-dismiss="modal"
                @click="closeModal"
              >
                取消
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="updateProduct"
              >
                確認
              </button>
            </div>
          </div>
        </div>
      </div>
        `,
};
