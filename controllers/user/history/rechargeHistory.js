const asyncHandler = require("../../../helpers/asyncHandler");
const { getDateFormatForPost, extractTime } = require("../../../helpers/dateTime");
const {  getUserRechargeHistoryByUserid } = require("../../../helpers/history");
const { openToken } = require("../../../helpers/jwt");
const { getNextOffset, paginateData } = require("../../../helpers/pagination");

exports.userRechargeHistoryGet = asyncHandler(async (req, res, next) => {
    const { id } = await openToken(req.signedCookies[process.env.TOKEN_NAME]);
    const type = req.query.type, limit = req.query.limit || parseInt(process.env.LIMIT),currentPage = parseInt(req.query.page)|| 1;
    
    //Pagination VAR
    let paginationArr,link,prevBtn = null, nextBtn = null;

    const history = await getUserRechargeHistoryByUserid(id, type, limit, getNextOffset(currentPage, limit));
    
    await history.map(h => {
        h.time = extractTime(h.issue_at,"hh:mm A");
        h.date = getDateFormatForPost(h.issue_at)
    });

    //Pagination
    const pageData = await getUserRechargeHistoryByUserid(id, type, 9999999999, 0);
    paginationArr = paginateData(limit, pageData.length);
  
    //Prev
    if (currentPage > 1) {
        prevBtn = currentPage - 1;
    }

    //Next
    if (currentPage !== "" && paginationArr[paginationArr.length - 1] > currentPage) {
        nextBtn = currentPage + 1
    };

    //Pagination Link
    link = `/user/history/recharge?`

    res.render("user/pages/history/rechargeHistory", {
        title: "Recharge History",
        history,
        paginationArr,
        link,
        currentPage,
        prevBtn,
        nextBtn,
        type
    })
})