const asyncHandler = require("../../../helpers/asyncHandler");
const { getNextOffset, paginateData } = require("../../../helpers/pagination");
const { adminGetTransactionHistory } = require("../../../helpers/history");
const { extractTime, getDateFormatForPost } = require("../../../helpers/dateTime");


exports.adminTransactionHistoryGet = asyncHandler(async (req, res, next) => {
    const limit = req.query.limit || parseInt(process.env.LIMIT),currentPage = parseInt(req.query.page)|| 1;
    
    //Pagination VAR
    let paginationArr,link,prevBtn = null, nextBtn = null;

    const history = await adminGetTransactionHistory(limit, getNextOffset(currentPage, limit));
    
    await history.map(h => {
        h.time = extractTime(h.issue_at,"hh:mm A");
        h.date = getDateFormatForPost(h.issue_at)
    });

    //Pagination
    const pageData = await adminGetTransactionHistory(9999999999, 0);
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
    link = `/admin/history/transactions?`

    res.render("admin/pages/history/transactions", {
        title: "Transactions History",
        history,
        link,
        prevBtn,
        nextBtn
    })
})