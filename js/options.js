// options.js
document.addEventListener('DOMContentLoaded', function() {
    var mKeyInput = document.getElementById('mKey');
    var autoReplyInput = document.getElementById('autoReply');
    var makeDataTypeSelect = document.getElementById('makeDataType');
    var userKeywordInput = document.getElementById('userKeyword');
    var dataNumsInput = document.getElementById('dataNums');
    var commentContentInput = document.getElementById('commentContent');
    var saveButton = document.getElementById('saveButton');
    var checkBoxes = document.getElementsByName('action');
    // 获取保存的密钥值并设置输入框的默认值
    chrome.storage.local.get('nmx_dylive_setting', function(result) {
        let setting = result.nmx_dylive_setting;
        if (setting) {
            mKeyInput.value = setting.mkey;
            autoReplyInput.value = setting.autoReply;
            makeDataTypeSelect.value = setting.makeDataType;
            dataNumsInput.value = setting.dataNums;
            commentContentInput.value = setting.commentContent;
            userKeywordInput.value = setting.userKeyword;
            for (const checkbox of checkBoxes) {
                const value = checkbox.value;
                if (setting.actionMap[value] !== undefined) {
                    checkbox.checked = setting.actionMap[value];
                }
            }
            console.log(setting);
        }
    });

    // 保存按钮点击事件处理程序
    saveButton.addEventListener('click', function() {
        let setting = {
            'mkey':  mKeyInput.value,
            'autoReply': autoReplyInput.value,
            'makeDataType':makeDataTypeSelect.value,
            'dataNums':dataNumsInput.value,
            'commentContent':commentContentInput.value,
            'userKeyword':userKeywordInput.value
        };

        //获取操作map
        const selectedOptions = {};
        for (const checkbox of checkBoxes) {
            selectedOptions[checkbox.value] = checkbox.checked;
        }
        setting.actionMap = selectedOptions;

        chrome.storage.local.set({ 'nmx_dylive_setting': setting }, function() {
            alert('设置已保存');
        });
    });
});
