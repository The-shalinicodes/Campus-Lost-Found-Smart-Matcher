(function runMailScript(/* GlideRecord */ current, /* TemplatePrinter */ template,
    /* Optional EmailOutbound */ email, /* Optional GlideRecord */ email_action,
    /* Optional GlideRecord */ event) {
    var instanceUrl = gs.getProperty('glide.servlet.uri');
    var recordUrl = instanceUrl + '/' + current.getTableName() + '.do?sys_id=' + current.sys_id;
    template.print(recordUrl);
})(current, template, email, email_action, event);
