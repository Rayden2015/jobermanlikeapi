class APIFilters {
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    filter(){
        console.log('ApiFilter | filter() | queryStr : ');
        const queryCopy = { ...this.queryStr};

        //Removing fields from query
        const removeFields = ['sort','fields', 'q', 'limit', 'page'];
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

    limitFields(){
        if(this.queryStr.fields){
            const fields = this.query.fields.split(',').join('');
            this.query = this.query.select(fields);
        }else{
            this.query = this.query.select('-__v');
        }
        return this;
    }

    searchByQuery(){
        if(this.queryStr.q){
            const qu = this.queryStr.q.split('-').join(' ');
            console.log("Api Filter |searchByQuery() | qu : " +qu);
            this.query = this.query.find({$text : {$search: "\"" + qu +"\""}});
        }
    }

    pagination(){
        const page = parseInt(this.queryStr.page, 10) || 1;
        const limit = parseInt(this.queryStr.limit, 10) || 10;
        const skipResults = (page - 1) * limit;
        
        this.query = this.query.skip(skipResults).limit(limit);
        //console.log("Api Filter | pagination() | query : " +this.query);
        return this;
    }
}

module.exports = APIFilters;