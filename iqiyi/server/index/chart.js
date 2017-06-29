/**
 * Created by Administrator on 2017/6/2.
 */

module.exports={
    chart:function (req,res) {
        var data=[
            {"label":"一月","value":"100"},
            {"label":"二月","value":"200"},
            {"label":"三月","value":"300"},
            {"label":"四月","value":"400"},
            {"label":"五月","value":"500"},
            {"label":"六月","value":"600"},
        ];
        console.log("111");
        res.json(data);
    }
};