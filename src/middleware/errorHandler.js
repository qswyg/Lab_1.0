function errorHandler(err, req, res, next) {
    console.error('[SERVER ERROR]:', err.message);
    

    if (err.message && err.message.includes("UNIQUE constraint failed")){
        return res.status(409).json({
            error: true,
            status: 409,
            message:" Такий email вже існує"
        });
    }
        if (err.message && err.message.includes("NOT NULL constraint failed")){
            return res.status(400).json({
                error: true,
                status: 400,
                message: "Обов'язкові поля не можуть бути порожніми "
            });
        }
        
        if (err.type=== 'entity.parse.failed'){
            return res.status(400).json({
                error: true,
                status: 400,
                message: "Некоректний формат запису"
            });
        }

        const statusCode = err.status || 500;
        res.status(statusCode).json({
            error: true,
            status: statusCode,
            message: err.message || "Внутрішня помилка сервера"
        });
    }

    module.exports = errorHandler;