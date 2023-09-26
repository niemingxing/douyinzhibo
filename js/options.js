// options.js
document.addEventListener('DOMContentLoaded', function() {
    var mKeyInput = document.getElementById('mKey');
    var autoReplyInput = document.getElementById('autoReply');
    var saveButton = document.getElementById('saveButton');

    // 获取保存的密钥值并设置输入框的默认值
    chrome.storage.local.get('nmx_dylive_setting', function(result) {
        let setting = result.nmx_dylive_setting;
        if (setting) {
            mKeyInput.value = setting.mkey;
            autoReplyInput.value = setting.autoReply;
            console.log(setting);
        }
    });

    // 保存按钮点击事件处理程序
    saveButton.addEventListener('click', function() {
        let setting = {
            'mkey':  mKeyInput.value,
            'autoReply': autoReplyInput.value,
        };
        chrome.storage.local.set({ 'nmx_dylive_setting': setting }, function() {
            alert('设置已保存');
        });
    });
});
