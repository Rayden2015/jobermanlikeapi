class APIFilters {
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    filter(){
        console.log('ApiFilter | filter() | queryStr : ');
        const queryCopy = { ...this.queryStr};

        //Removing fields from query
        const removeFields = ['sort'];
        removeFields.forEach(el => delete queryCopy[el]);
        
        //Advance filter using : lt, lte, gt, gte
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        console.log(this.queryStr);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort(){
        console.log('ApiFilter | sort()');
        if(this.queryStr.sort){
            const sortBy = this.queryStr.sort.split(',').join(' ');
            console.log(sortBy);

            this.query = this.query.sort(sortBy);
        }else{
            this.query = this.query.sort('-postingDate');
        }

        return this;
    }
}

module.exports = APIFilters;